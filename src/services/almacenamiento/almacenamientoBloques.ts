"use client";
import BloqueTiempo from "@/models/BloqueTiempo";

/*
  Obtiene los bloques guardados en el localStorage o retorna un objeto vacío si no hay cursos guardados
*/
export function obtenerBloquesGuardados() {
  const bloquesGuardados = {};
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("bloques") || "{}");
  }
  return bloquesGuardados;
}

/*
  Elimina un bloque de tiempo del localStorage
*/
export function eliminarBloque(bloque: BloqueTiempo) {
  if (typeof window !== "undefined") {
    const bloquesGuardados = JSON.parse(localStorage.getItem("bloques") || "{}");
    bloquesGuardados[bloque.titulo] = bloquesGuardados[bloque.titulo].filter((bloqueGuardado: BloqueTiempo) => Object.values(bloqueGuardado).join('') !== Object.values(bloque).join(''));
    localStorage.setItem("bloques", JSON.stringify(bloquesGuardados));
  }
}

/*
  Guarda un bloque de tiempo en el localStorage
*/
export function guardarBloque(bloque: BloqueTiempo) {
  if (typeof window !== "undefined") {
    if (!localStorage.getItem("bloques")) {
      localStorage.setItem("bloques", JSON.stringify({}));
    }
    const bloquesGuardados = JSON.parse(localStorage.getItem("bloques") || "{}");
    if (!(bloque.titulo in bloquesGuardados)) {
      bloquesGuardados[bloque.titulo] = [];
    }
    bloquesGuardados[bloque.titulo].push(bloque);
    localStorage.setItem("bloques", JSON.stringify(bloquesGuardados));
  }
}