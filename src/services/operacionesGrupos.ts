export interface CursoAgrupable {
  programa: string;
  curso: string;
}

export interface SeccionConCreditos {
  curso: CursoAgrupable & { creditos: number };
}

export interface GrupoConCursos {
  cursos: string[];
}

export function generarCombinacionesDeCursos<T extends CursoAgrupable>(
  cursos: T[],
  grupos: string[][],
): T[][] {
  const cursosPorCodigo = new Map(
    cursos.map((curso) => [curso.programa + curso.curso, curso]),
  );
  const gruposValidos = grupos
    .map((grupo) =>
      Array.from(new Set(grupo)).filter((codigo) => cursosPorCodigo.has(codigo)),
    )
    .filter((grupo) => grupo.length > 0);
  const codigosEnGrupos = new Set(gruposValidos.flat());
  const cursosSinGrupo = cursos.filter(
    (curso) => !codigosEnGrupos.has(curso.programa + curso.curso),
  );
  let combinaciones: T[][] = [cursosSinGrupo];

  for (const grupo of gruposValidos) {
    combinaciones = combinaciones.flatMap((combinacion) =>
      grupo.map((codigo) => {
        const curso = cursosPorCodigo.get(codigo);
        if (!curso) return combinacion;
        const yaFueElegido = combinacion.some(
          (cursoExistente) =>
            cursoExistente.programa + cursoExistente.curso === codigo,
        );
        return yaFueElegido ? null : [...combinacion, curso];
      }).filter((combinacion): combinacion is T[] => combinacion !== null),
    );
    const unicas = new Map<string, T[]>();
    combinaciones.forEach((combinacion) => {
      const clave = combinacion
        .map((curso) => curso.programa + curso.curso)
        .sort()
        .join("-");
      unicas.set(clave, combinacion);
    });
    combinaciones = Array.from(unicas.values());
  }

  return combinaciones;
}

export function limpiarGruposSinCursos<T extends GrupoConCursos>(
  grupos: T[],
  cursosPlaneados: ReadonlySet<string>,
): Array<Omit<T, "cursos"> & { cursos: string[] }> {
  return grupos
    .map((grupo) => ({
      ...grupo,
      cursos: grupo.cursos.filter((codigo) => cursosPlaneados.has(codigo)),
    }))
    .filter((grupo) => grupo.cursos.length > 0);
}

export function calcularCreditosTotales(secciones: SeccionConCreditos[]): number {
  const cursosContados = new Set<string>();
  return secciones.reduce((total, seccion) => {
    const codigoCurso = seccion.curso.programa + seccion.curso.curso;
    if (cursosContados.has(codigoCurso)) return total;
    cursosContados.add(codigoCurso);
    return total + Number(seccion.curso.creditos);
  }, 0);
}
