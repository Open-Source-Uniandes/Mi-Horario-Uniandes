const criteriosIncompatibles: ReadonlyArray<readonly [string, string]> = [
  ["más créditos", "menos créditos"],
];

export function sonCriteriosIncompatibles(
  primerCriterio: string,
  segundoCriterio: string,
): boolean {
  return criteriosIncompatibles.some(
    ([primero, segundo]) =>
      (primerCriterio === primero && segundoCriterio === segundo) ||
      (primerCriterio === segundo && segundoCriterio === primero),
  );
}

export function normalizarCriteriosOrdenamiento(criterios: string[]): string[] {
  const normalizados: string[] = [];
  for (const criterio of criterios) {
    if (
      normalizados.includes(criterio) ||
      normalizados.some((existente) =>
        sonCriteriosIncompatibles(existente, criterio),
      )
    ) {
      continue;
    }
    normalizados.push(criterio);
  }
  return normalizados;
}
