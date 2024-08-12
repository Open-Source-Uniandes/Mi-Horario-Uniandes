"use client";

import Seccion from "@/models/Seccion";

/*
  Obtiene los planes guardados en el localStorage o retorna un objeto vacío si no hay planes guardados
*/
export function obtenerPlanesGuardados() {
  const planesGuardados = {};
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("planes") || "{}");
  }
  return planesGuardados;
}

/*
  Obtiene un plan guardado en el localStorage

  @param planId El id del plan a obtener
*/
export function obtenerPlanGuardado(planId: number) {
  return obtenerPlanesGuardados()[planId];
}

/*
  Elimina un plan del localStorage
*/
export function eliminarPlanGuardado(planId: number) {
  if (typeof window !== "undefined") {
    const planesGuardados = JSON.parse(localStorage.getItem("planes") || "{}");
    delete planesGuardados[planId];
    localStorage.setItem("planes", JSON.stringify(planesGuardados));
  }
}

/*
  Revisa si es posible crear un plan, un usuario puede tener máximo 5 planes
*/
export function esPosibleCrearPlan() {
  if (typeof window !== "undefined") {
    const planesGuardados = JSON.parse(localStorage.getItem("planes") || "{}");
    return Object.keys(planesGuardados).length <= 5;
  }
  return false;
}

/*
  Convierte un arreglo de secciones a un plan de la forma {codigoCurso: nrc}
*/
function covertirSeccionesAPlan(secciones: Seccion[]) {
  const nrcPorCurso: {[codigo: string]: number} = {};
  secciones.forEach((seccion) => {
    let codigoCurso = seccion.curso.programa + seccion.curso.curso;
    nrcPorCurso[codigoCurso] = seccion.nrc;
  });
  return nrcPorCurso;
}

/*
  Guarda un plan en el localStorage
*/
export function guardarPlan({ secciones }: { secciones: Seccion[] }) {
  if (typeof window !== "undefined") {
    if (!localStorage.getItem("planes")) {
      localStorage.setItem("planes", JSON.stringify({}));
    }
    const planesGuardados = JSON.parse(localStorage.getItem("planes") || "{}");
    const planId = Object.keys(planesGuardados).length + 1;
    const plan = covertirSeccionesAPlan(secciones);
    planesGuardados[planId] = plan;
    localStorage.setItem("planes", JSON.stringify(planesGuardados));
  }
}

