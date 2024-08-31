"use client";
/*
    Obtiene los cursos guardados en el localStorage o retorna un objeto vacío si no hay cursos guardados
*/
export function obtenerCursosGuardados() {
  const cursosGuardados = {};
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("cursos") || "{}");
  }
  return cursosGuardados;
}

/*
    Elimina un curso del localStorage
*/
export function eliminarCursoGuardado(curso: string) {
  if (typeof window !== "undefined") {
    const cursosGuardados = JSON.parse(localStorage.getItem("cursos") || "{}");
    delete cursosGuardados[curso];
    localStorage.setItem("cursos", JSON.stringify(cursosGuardados));
  }
}


/*
  Añade varias secciones de un curso al localStorage

  @param curso El curso al que pertenecen las secciones
  @param secciones Las secciones a añadir
*/
export function añadirVariasSeccionesDeCurso(curso: string, secciones: string[]) {
  if (typeof window !== "undefined") {
    crearCursoSiNoExiste(curso);
    const cursosGuardados = JSON.parse(localStorage.getItem("cursos") || "{}");
    cursosGuardados[curso] = secciones;
    localStorage.setItem("cursos", JSON.stringify(cursosGuardados));
  }
}

/*
  Verifica si una sección de un curso está guardada en el localStorage

  @param curso El curso al que pertenece la sección
  @param seccion La sección a verificar
*/
export function cursoTieneSeccionGuardada(curso: string, seccion: string) {
  if (typeof window !== "undefined") {
    const cursosGuardados = JSON.parse(localStorage.getItem("cursos") || "{}");
    return cursosGuardados[curso] && cursosGuardados[curso].includes(seccion);
  }
  return false;
}

/*
  Precondición: ya se ha verificado que el localStorage está disponible

  Cambia la presencia de una sección en un curso
  Si la sección ya está guardada, la elimina
  Si la sección no está guardada, la agrega

  @param curso El curso al que pertenece la sección
  @param seccion La sección a cambiar
*/
function cambiarPresenciaDeSeccion(curso: string, seccion: string) {
  const cursosGuardados = JSON.parse(localStorage.getItem("cursos") || "{}");
  if (!cursosGuardados[curso].includes(seccion)) {
    cursosGuardados[curso].push(seccion);
    cursosGuardados[curso].sort( (a: string, b: string) => a.localeCompare(b));
  } else {
    cursosGuardados[curso] = cursosGuardados[curso].filter((seccionGuardada: string) => seccionGuardada !== seccion);
    if (cursosGuardados[curso].length === 0) {
      delete cursosGuardados[curso];
    }
}
  localStorage.setItem("cursos", JSON.stringify(cursosGuardados));
}

/*
  Precondición: ya se ha verificado que el localStorage está disponible

  Crea un curso si no existe en el localStorage

  @param curso El curso a crear
*/
function crearCursoSiNoExiste(curso: string) {
  if (!localStorage.getItem("cursos")) {
    localStorage.setItem("cursos", JSON.stringify({}));
  }
  const cursosGuardados = JSON.parse(localStorage.getItem("cursos") || "{}");
  if (!cursosGuardados[curso]) {
    cursosGuardados[curso] = [];
  }
  localStorage.setItem("cursos", JSON.stringify(cursosGuardados));
}

/*
  Guarda una sección de un curso en el localStorage

  @param curso El curso al que pertenece la sección
  @param seccion La sección a guardar
*/
export function guardarSeccionDeCurso(curso: string, seccion: string) {
  if (typeof window !== "undefined") {
    crearCursoSiNoExiste(curso);
    cambiarPresenciaDeSeccion(curso, seccion);
  }
}

