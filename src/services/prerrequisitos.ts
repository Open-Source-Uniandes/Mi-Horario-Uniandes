export type RequisitoCurso = {
  tipo: "curso";
  codigo: string;
  descripcion: string;
};

export type RequisitoLogico = {
  tipo: "y" | "o";
  hijos: Requisito[];
  descripcion?: string;
};

export type RequisitoSinInterpretar = {
  tipo: "sin-interpretar";
  codigo: string;
  descripcion: string;
};

export type Requisito = RequisitoCurso | RequisitoLogico | RequisitoSinInterpretar;

type Token = { tipo: "curso"; valor: string } | { tipo: "y" | "o" | "(" | ")"; valor: string };
type DetalleRequisitosAPI = {
  nrc: string;
  term: string;
  ptrm: string;
  prereq: Array<{ code: string; descr: string }>;
};
type SeccionOferta = {
  class: string;
  course: string;
  nrc: number;
  term: string;
  ptrm: string;
};

const API = "https://ofertadecursos.uniandes.edu.co/api";
const cacheDetalles = new Map<string, Promise<Requisito | null>>();
const cacheOfertas = new Map<string, Promise<SeccionOferta | null>>();

function tokenizar(expresion: string): Token[] {
  const patron = /\(|\)|\b(?:Y|O)\b|[A-Z][A-Z0-9]*(?:\s+\d{1,4})?/g;
  const encontrados = expresion.toUpperCase().match(patron) || [];
  const compactar = (texto: string) => texto.replace(/\s+/g, "");
  if (!expresion.trim() || compactar(encontrados.join("")) !== compactar(expresion.toUpperCase())) {
    throw new Error("No se pudo interpretar la expresión de prerrequisitos.");
  }
  return encontrados.map((valor) => {
    const normalizado = valor.trim();
    if (normalizado === "(" || normalizado === ")") return { tipo: normalizado, valor: normalizado };
    if (normalizado === "Y" || normalizado === "O") return { tipo: normalizado.toLowerCase() as "y" | "o", valor: normalizado };
    return { tipo: "curso", valor: normalizado.replace(/\s+/g, " ") };
  });
}

export function interpretarExpresionDeRequisitos(expresion: string, descripcion: string): Requisito {
  let tokens: Token[];
  try {
    tokens = tokenizar(expresion);
  } catch {
    return { tipo: "sin-interpretar", codigo: expresion, descripcion };
  }
  let posicion = 0;

  const parsearPrimario = (): Requisito => {
    const token = tokens[posicion];
    if (!token) throw new Error("La expresión de prerrequisitos está incompleta.");
    if (token.tipo === "(") {
      posicion++;
      const resultado = parsearO();
      if (tokens[posicion]?.tipo !== ")") throw new Error("Falta cerrar un grupo de prerrequisitos.");
      posicion++;
      return resultado;
    }
    if (token.tipo !== "curso") throw new Error("La expresión de prerrequisitos no es válida.");
    posicion++;
    return { tipo: "curso", codigo: token.valor, descripcion: "" };
  };

  const combinar = (tipo: "y" | "o", parsearHijo: () => Requisito): Requisito => {
    const hijos = [parsearHijo()];
    while (tokens[posicion]?.tipo === tipo) {
      posicion++;
      hijos.push(parsearHijo());
    }
    return hijos.length === 1 ? hijos[0] : { tipo, hijos };
  };

  const parsearY = () => combinar("y", parsearPrimario);
  const parsearO = () => combinar("o", parsearY);

  try {
    const resultado = parsearO();
    if (posicion !== tokens.length) throw new Error("La expresión contiene elementos adicionales.");
    if (resultado.tipo === "sin-interpretar") return resultado;
    return { ...resultado, descripcion };
  } catch {
    return { tipo: "sin-interpretar", codigo: expresion, descripcion };
  }
}

function agruparRequisitos(requisitos: Requisito[]): Requisito | null {
  if (requisitos.length === 0) return null;
  if (requisitos.length === 1) return requisitos[0];
  return { tipo: "y", hijos: requisitos };
}

export async function obtenerRequisitosDeSeccion(term: string, ptrm: string, nrc: number | string): Promise<Requisito | null> {
  const clave = `${term}:${ptrm}:${nrc}`;
  const existente = cacheDetalles.get(clave);
  if (existente) return existente;

  const solicitud = (async () => {
    const parametros = new URLSearchParams({ term, ptrm, nrc: String(nrc) });
    const respuesta = await fetch(`${API}/courseDetails?${parametros}`);
    if (!respuesta.ok) throw new Error(`No se pudieron cargar los prerrequisitos (HTTP ${respuesta.status}).`);
    const datos: unknown = await respuesta.json();
    if (!datos || typeof datos !== "object" || !Array.isArray((datos as DetalleRequisitosAPI).prereq)) {
      throw new Error("La API devolvió detalles de prerrequisitos con un formato inesperado.");
    }
    const detalles = datos as DetalleRequisitosAPI;
    return agruparRequisitos(detalles.prereq.map((requisito) =>
      interpretarExpresionDeRequisitos(requisito.code || "", requisito.descr || ""),
    ));
  })();
  cacheDetalles.set(clave, solicitud);
  try {
    return await solicitud;
  } catch (error) {
    cacheDetalles.delete(clave);
    throw error;
  }
}

export async function buscarOfertaDeCurso(term: string, codigo: string): Promise<SeccionOferta | null> {
  const clave = `${term}:${codigo.replace(/\s+/g, "").toUpperCase()}`;
  const existente = cacheOfertas.get(clave);
  if (existente) return existente;

  const solicitud = (async () => {
    const parametros = new URLSearchParams({
      term,
      ptrm: "",
      prefix: "",
      attr: "",
      nameInput: codigo,
    });
    const respuesta = await fetch(`${API}/courses?${parametros}`);
    if (!respuesta.ok) throw new Error(`No se pudo buscar ${codigo} (HTTP ${respuesta.status}).`);
    const datos: unknown = await respuesta.json();
    if (!Array.isArray(datos)) throw new Error("La API devolvió una oferta con un formato inesperado.");
    const objetivo = codigo.replace(/\s+/g, "").toUpperCase();
    const secciones = datos as SeccionOferta[];
    return secciones.find((seccion) =>
      `${seccion.class}${seccion.course}`.replace(/\s+/g, "").toUpperCase() === objetivo,
    ) || null;
  })();
  cacheOfertas.set(clave, solicitud);
  try {
    return await solicitud;
  } catch (error) {
    cacheOfertas.delete(clave);
    throw error;
  }
}

export async function obtenerRequisitosDeCurso(term: string, codigo: string): Promise<{
  seccion: SeccionOferta;
  requisitos: Requisito | null;
} | null> {
  const seccion = await buscarOfertaDeCurso(term, codigo);
  if (!seccion) return null;
  const requisitos = await obtenerRequisitosDeSeccion(seccion.term, seccion.ptrm, seccion.nrc);
  return { seccion, requisitos };
}
