"use client";

export interface GrupoCurso {
  nombre: string;
  cursos: string[];
}

function esListaDeCursos(valor: unknown): valor is string[] {
  return Array.isArray(valor) && valor.every((curso: unknown) => typeof curso === "string");
}

export function obtenerGruposGuardados(): GrupoCurso[] {
  if (typeof window === "undefined") return [];
  const guardados: unknown = JSON.parse(localStorage.getItem("grupos") || "[]");
  if (!Array.isArray(guardados)) return [];
  return guardados.flatMap((grupo, indice): GrupoCurso[] => {
    if (esListaDeCursos(grupo)) {
      return [{ nombre: `Grupo ${indice + 1}`, cursos: grupo }];
    }
    if (
      typeof grupo === "object" &&
      grupo !== null &&
      "nombre" in grupo &&
      typeof grupo.nombre === "string" &&
      "cursos" in grupo &&
      esListaDeCursos(grupo.cursos)
    ) {
      return [{ nombre: grupo.nombre, cursos: grupo.cursos }];
    }
    return [];
  });
}

export function guardarGrupos(grupos: GrupoCurso[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("grupos", JSON.stringify(grupos));
  }
}
