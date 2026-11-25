"use client";

export type CursoGuardado = {
  periodo: string;
  secciones: string[];
};

export type CursosGuardados = Record<string, CursoGuardado>;

function obtenerPeriodoDeSeccion(seccionId: string) {
  return seccionId.split("_")[1] || "";
}

function leerCursosGuardados(): CursosGuardados {
  if (typeof window === "undefined") return {};

  const cursosGuardados = JSON.parse(localStorage.getItem("cursos") || "{}") as Record<string, unknown>;
  let requiereMigracion = false;
  const cursosNormalizados: CursosGuardados = {};

  for (const [codigo, valor] of Object.entries(cursosGuardados)) {
    if (Array.isArray(valor)) {
      const secciones = valor.filter((seccion): seccion is string => typeof seccion === "string");
      const periodos = Array.from(new Set(secciones.map(obtenerPeriodoDeSeccion).filter(Boolean)));
      const periodo = periodos.length === 1 ? periodos[0] : "";
      if (secciones.length > 0) cursosNormalizados[codigo] = { periodo, secciones };
      requiereMigracion = true;
    } else if (valor && typeof valor === "object") {
      const curso = valor as Record<string, unknown>;
      if (typeof curso.periodo !== "string" || !Array.isArray(curso.secciones)) continue;
      const secciones = curso.secciones.filter((seccion: unknown): seccion is string => typeof seccion === "string");
      if (secciones.length === 0) continue;
      cursosNormalizados[codigo] = {
        periodo: curso.periodo,
        secciones,
      };
    }
  }

  if (requiereMigracion) {
    localStorage.setItem("cursos", JSON.stringify(cursosNormalizados));
  }
  return cursosNormalizados;
}

function guardarCursos(cursosGuardados: CursosGuardados) {
  localStorage.setItem("cursos", JSON.stringify(cursosGuardados));
}

function periodoCompatible(cursosGuardados: CursosGuardados, periodo: string) {
  return Boolean(periodo) && Object.values(cursosGuardados).every((curso) => curso.periodo === periodo);
}

export function periodoCompatibleConCursosGuardados(periodo: string) {
  return periodoCompatible(leerCursosGuardados(), periodo);
}

/*
    Obtiene los cursos guardados en el localStorage o retorna un objeto vacío si no hay cursos guardados
*/
export function obtenerCursosGuardados() {
  return leerCursosGuardados();
}

/*
    Elimina un curso del localStorage
*/
export function eliminarCursoGuardado(curso: string) {
  if (typeof window !== "undefined") {
    const cursosGuardados = leerCursosGuardados();
    delete cursosGuardados[curso];
    guardarCursos(cursosGuardados);
  }
}


/*
  Añade varias secciones de un curso al localStorage

  @param curso El curso al que pertenecen las secciones
  @param seccionIds Los ids de las secciones a añadir
*/
export function añadirVariasSeccionesDeCurso(curso: string, seccionIds: string[], periodo: string) {
  if (typeof window !== "undefined") {
    if (seccionIds.length === 0) return true;
    const cursosGuardados = leerCursosGuardados();
    if (!periodoCompatible(cursosGuardados, periodo) || seccionIds.some((id) => obtenerPeriodoDeSeccion(id) !== periodo)) {
      return false;
    }
    cursosGuardados[curso] = { periodo, secciones: Array.from(new Set(seccionIds)) };
    guardarCursos(cursosGuardados);
    return true;
  }
  return false;
}

/*
  Verifica si una sección de un curso está guardada en el localStorage

  @param curso El curso al que pertenece la sección
  @param seccionId El id de la sección a verificar
*/
export function cursoTieneSeccionGuardada(curso: string, seccionId: string) {
  if (typeof window !== "undefined") {
    const cursosGuardados = leerCursosGuardados();
    return cursosGuardados[curso]?.secciones.includes(seccionId) || false;
  }
  return false;
}

/*
  Precondición: ya se ha verificado que el localStorage está disponible

  Cambia la presencia de una sección en un curso
  Si la sección ya está guardada, la elimina
  Si la sección no está guardada, la agrega

  @param curso El curso al que pertenece la sección
  @param seccionId El id de la sección a cambiar
*/
function cambiarPresenciaDeSeccion(curso: string, seccionId: string, periodo: string) {
  const cursosGuardados = leerCursosGuardados();
  if (!cursoTieneSeccionGuardada(curso, seccionId)) {
    if (!periodoCompatible(cursosGuardados, periodo) || obtenerPeriodoDeSeccion(seccionId) !== periodo) {
      return false;
    }
    const secciones = cursosGuardados[curso]?.secciones || [];
    cursosGuardados[curso] = {
      periodo,
      secciones: [...secciones, seccionId].sort((a, b) => a.localeCompare(b)),
    };
  } else {
    cursosGuardados[curso].secciones = cursosGuardados[curso].secciones.filter((guardada) => guardada !== seccionId);
    if (cursosGuardados[curso].secciones.length === 0) {
      delete cursosGuardados[curso];
    }
  }
  guardarCursos(cursosGuardados);
  return true;
}

/*
  Guarda una sección de un curso en el localStorage

  @param curso El curso al que pertenece la sección
  @param seccionId El id de la sección a guardar
*/
export function guardarSeccionDeCurso(curso: string, seccionId: string, periodo: string) {
  if (typeof window !== "undefined") {
    return cambiarPresenciaDeSeccion(curso, seccionId, periodo);
  }
  return false;
}
