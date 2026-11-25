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
export type RequisitoPlano = { prerrequisito: string; descripcion: string };
export type DetalleRequisitosSeccion = {
  requisitos: Requisito | null;
  plano: RequisitoPlano[];
};

type Token = { tipo: "curso"; valor: string } | { tipo: "y" | "o" | "(" | ")"; valor: string };
type DetalleRequisitosAPI = {
  nrc: string;
  term: string;
  ptrm: string;
  prereq: Array<{ code: string; descr: string }>;
};
const API = "https://ofertadecursos.uniandes.edu.co/api";
const cacheDetalles = new Map<string, Promise<DetalleRequisitosSeccion>>();

type OperadorRequisito = {
  tipo: "y" | "o";
  izquierdaEsGrupo: boolean;
  derechaEsGrupo: boolean;
};

function extraerOperadores(requisito: Requisito): OperadorRequisito[] {
  if (requisito.tipo === "curso" || requisito.tipo === "sin-interpretar") return [];
  const operadores: OperadorRequisito[] = [];
  requisito.hijos.forEach((hijo, indice) => {
    if (indice > 0) {
      operadores.push({
        tipo: requisito.tipo,
        izquierdaEsGrupo: requisito.hijos[indice - 1].tipo === "y" || requisito.hijos[indice - 1].tipo === "o",
        derechaEsGrupo: hijo.tipo === "y" || hijo.tipo === "o",
      });
    }
    operadores.push(...extraerOperadores(hijo));
  });
  return operadores;
}

function extraerNombres(requisito: Requisito, descripcion: string): string[] | null {
  const limpiarNombre = (fragmento: string): string => {
    let nombre = fragmento.trim();
    const balance = (texto: string) => {
      let nivel = 0;
      for (let indice = 0; indice < texto.length; indice++) {
        const caracter = texto[indice];
        if (caracter === "(") nivel++;
        if (caracter === ")") nivel--;
      }
      return nivel;
    };
    while (nombre.startsWith("(") && balance(nombre) > 0) nombre = nombre.slice(1).trim();
    while (nombre.endsWith(")") && balance(nombre) < 0) nombre = nombre.slice(0, -1).trim();
    while (nombre.startsWith("(") && nombre.endsWith(")")) {
      const interior = nombre.slice(1, -1);
      if (balance(interior) !== 0) break;
      nombre = interior.trim();
    }
    return nombre;
  };

  const operadores = extraerOperadores(requisito);
  const ocurrencias: Array<{ tipo: "y" | "o"; inicio: number; fin: number }> = [];
  const patron = /(^|[\s(])([YO])(?=$|[\s)])/gi;
  let coincidencia: RegExpExecArray | null;
  while ((coincidencia = patron.exec(descripcion)) !== null) {
    const inicio = coincidencia.index + coincidencia[1].length;
    ocurrencias.push({
      tipo: coincidencia[2].toLowerCase() as "y" | "o",
      inicio,
      fin: inicio + coincidencia[2].length,
    });
  }

  const cache = new Map<string, { nombres: string[]; puntuacion: number } | null>();
  const buscar = (
    indiceOperador: number,
    indiceOcurrencia: number,
    inicioFragmento: number,
  ): { nombres: string[]; puntuacion: number } | null => {
    const clave = `${indiceOperador}:${indiceOcurrencia}:${inicioFragmento}`;
    if (cache.has(clave)) return cache.get(clave) || null;
    if (indiceOperador === operadores.length) {
      const ultimoNombre = limpiarNombre(descripcion.slice(inicioFragmento));
      const resultado = ultimoNombre ? { nombres: [ultimoNombre], puntuacion: 0 } : null;
      cache.set(clave, resultado);
      return resultado;
    }

    let mejorResultado: { nombres: string[]; puntuacion: number } | null = null;
    for (let indice = indiceOcurrencia; indice < ocurrencias.length; indice++) {
      const ocurrencia = ocurrencias[indice];
      const operador = operadores[indiceOperador];
      if (ocurrencia.tipo !== operador.tipo) continue;
      const nombre = limpiarNombre(descripcion.slice(inicioFragmento, ocurrencia.inicio));
      if (!nombre) continue;
      const resultado = buscar(
        indiceOperador + 1,
        indice + 1,
        ocurrencia.fin,
      );
      if (!resultado) continue;

      const antesDelOperador = descripcion.slice(0, ocurrencia.inicio).trimEnd();
      const despuesDelOperador = descripcion.slice(ocurrencia.fin).trimStart();
      const izquierdaEsGrupo = antesDelOperador.endsWith(")");
      const derechaEsGrupo = despuesDelOperador.startsWith("(");
      const puntuacion =
        (izquierdaEsGrupo === operador.izquierdaEsGrupo ? 1 : -1)
        + (derechaEsGrupo === operador.derechaEsGrupo ? 2 : -1)
        + resultado.puntuacion;
      if (!mejorResultado || puntuacion > mejorResultado.puntuacion) {
        mejorResultado = { nombres: [nombre, ...resultado.nombres], puntuacion };
      }
    }
    cache.set(clave, mejorResultado);
    return mejorResultado;
  };

  return buscar(0, 0, 0)?.nombres || null;
}

function asignarDescripciones(requisito: Requisito, nombres: string[]): Requisito | null {
  let indice = 0;
  const visitar = (actual: Requisito): Requisito | null => {
    if (actual.tipo === "curso") {
      const descripcion = nombres[indice++];
      return descripcion ? { ...actual, descripcion } : null;
    }
    if (actual.tipo === "sin-interpretar") return null;
    const hijos = actual.hijos.map(visitar);
    if (hijos.some((hijo) => !hijo)) return null;
    return { ...actual, hijos: hijos as Requisito[] };
  };
  const resultado = visitar(requisito);
  return resultado && indice === nombres.length ? resultado : null;
}

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
    const nombres = extraerNombres(resultado, descripcion) || [];
    const conDescripciones = nombres.length > 0
      ? asignarDescripciones(resultado, nombres)
      : null;
    if (!conDescripciones) return { ...resultado, descripcion };
    return conDescripciones.tipo === "curso"
      ? conDescripciones
      : { ...conDescripciones, descripcion };
  } catch {
    return { tipo: "sin-interpretar", codigo: expresion, descripcion };
  }
}

function agruparRequisitos(requisitos: Requisito[]): Requisito | null {
  if (requisitos.length === 0) return null;
  if (requisitos.length === 1) return requisitos[0];
  return { tipo: "y", hijos: requisitos };
}

export async function obtenerRequisitosDeSeccion(term: string, ptrm: string, nrc: number | string): Promise<DetalleRequisitosSeccion> {
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
    return {
      requisitos: agruparRequisitos(detalles.prereq.map((requisito) =>
        interpretarExpresionDeRequisitos(requisito.code || "", requisito.descr || ""),
      )),
      plano: detalles.prereq.map((requisito) => ({
        prerrequisito: requisito.code || "",
        descripcion: requisito.descr || "",
      })),
    };
  })();
  cacheDetalles.set(clave, solicitud);
  try {
    return await solicitud;
  } catch (error) {
    cacheDetalles.delete(clave);
    throw error;
  }
}
