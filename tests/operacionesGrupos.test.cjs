const assert = require("node:assert/strict");
const { describe, it } = require("node:test");
const {
  calcularCreditosTotales,
  generarCombinacionesDeCursos,
  limpiarGruposSinCursos,
} = require("../.test-dist/operacionesGrupos.js");
const {
  normalizarCriteriosOrdenamiento,
  sonCriteriosIncompatibles,
} = require("../.test-dist/criteriosOrdenamiento.js");

function curso(codigo, creditos = 3) {
  return {
    programa: codigo.slice(0, 4),
    curso: codigo.slice(4),
    creditos,
  };
}

function codigos(combinacion) {
  return combinacion
    .map((item) => item.programa + item.curso)
    .sort();
}

describe("generarCombinacionesDeCursos", () => {
  it("incluye todos los cursos planeados que no pertenecen a grupos", () => {
    const cursos = [curso("BIOL1101"), curso("QUIM1200")];

    assert.deepEqual(
      generarCombinacionesDeCursos(cursos, []).map(codigos),
      [["BIOL1101", "QUIM1200"]],
    );
  });

  it("elige exactamente una alternativa por grupo y conserva los cursos sin grupo", () => {
    const cursos = [
      curso("BIOL1101"),
      curso("QUIM1200"),
      curso("MATE1100"),
      curso("FISI1100"),
      curso("HIST1100"),
    ];
    const combinaciones = generarCombinacionesDeCursos(cursos, [
      ["BIOL1101", "QUIM1200"],
      ["MATE1100", "FISI1100"],
    ]);

    assert.equal(combinaciones.length, 4);
    for (const combinacion of combinaciones) {
      const elegidos = codigos(combinacion);
      assert.equal(elegidos.includes("HIST1100"), true);
      assert.equal(
        Number(elegidos.includes("BIOL1101")) +
          Number(elegidos.includes("QUIM1200")),
        1,
      );
      assert.equal(
        Number(elegidos.includes("MATE1100")) +
          Number(elegidos.includes("FISI1100")),
        1,
      );
    }
  });

  it("no permite que un mismo curso satisfaga varios grupos", () => {
    const cursos = [curso("BIOL1101"), curso("QUIM1200"), curso("MATE1100")];
    const combinaciones = generarCombinacionesDeCursos(cursos, [
      ["BIOL1101", "QUIM1200"],
      ["BIOL1101", "MATE1100"],
    ]);

    assert.deepEqual(
      combinaciones.map(codigos).sort((a, b) => a.join().localeCompare(b.join())),
      [
        ["BIOL1101", "MATE1100"],
        ["BIOL1101", "QUIM1200"],
        ["MATE1100", "QUIM1200"],
      ],
    );
    for (const combinacion of combinaciones) {
      assert.equal(new Set(codigos(combinacion)).size, combinacion.length);
    }
  });

  it("descarta horarios si la única alternativa de varios grupos es el mismo curso", () => {
    const cursos = [curso("BIOL1101")];

    assert.deepEqual(
      generarCombinacionesDeCursos(cursos, [
        ["BIOL1101"],
        ["BIOL1101"],
      ]),
      [],
    );
  });

  it("ignora grupos vacíos, cursos no planeados y cursos duplicados dentro de un grupo", () => {
    const cursos = [curso("BIOL1101"), curso("QUIM1200")];

    assert.deepEqual(
      generarCombinacionesDeCursos(cursos, [
        [],
        ["NOPE9999"],
        ["BIOL1101", "BIOL1101"],
      ]).map(codigos),
      [["BIOL1101", "QUIM1200"]],
    );
  });

  it("permite grupos con un solo curso", () => {
    const cursos = [curso("BIOL1101"), curso("QUIM1200")];

    assert.deepEqual(
      generarCombinacionesDeCursos(cursos, [["BIOL1101"]]).map(codigos),
      [["BIOL1101", "QUIM1200"]],
    );
  });
});

describe("limpiarGruposSinCursos", () => {
  it("elimina grupos vacíos y cursos que ya no están planeados", () => {
    const grupos = [
      { nombre: "Electivas", cursos: ["BIOL1101", "QUIM1200"] },
      { nombre: "Vacío", cursos: ["MATE1100"] },
      { nombre: "Ya vacío", cursos: [] },
    ];

    assert.deepEqual(
      limpiarGruposSinCursos(grupos, new Set(["BIOL1101"])),
      [{ nombre: "Electivas", cursos: ["BIOL1101"] }],
    );
    assert.deepEqual(grupos[0].cursos, ["BIOL1101", "QUIM1200"]);
  });
});

describe("calcularCreditosTotales", () => {
  it("suma créditos distintos según el curso elegido en cada grupo", () => {
    const cursos = [curso("BIOL1101", 2), curso("QUIM1200", 4), curso("MATE1100", 3)];
    const horarios = generarCombinacionesDeCursos(cursos, [
      ["BIOL1101", "QUIM1200"],
    ]);
    const totales = horarios
      .map((combinacion) =>
        calcularCreditosTotales(combinacion.map((item) => ({ curso: item }))),
      )
      .sort((a, b) => a - b);

    assert.deepEqual(totales, [5, 7]);
  });

  it("cuenta un curso una sola vez incluso si aparecen varias secciones suyas", () => {
    const biologia = curso("BIOL1101", 2);
    const quimica = curso("QUIM1200", 4);

    assert.equal(
      calcularCreditosTotales([
        { curso: biologia },
        { curso: biologia },
        { curso: quimica },
      ]),
      6,
    );
  });

  it("devuelve cero cuando el horario no tiene secciones", () => {
    assert.equal(calcularCreditosTotales([]), 0);
  });
});

describe("criterios de ordenamiento incompatibles", () => {
  it("reconoce más y menos créditos como criterios incompatibles", () => {
    assert.equal(sonCriteriosIncompatibles("más créditos", "menos créditos"), true);
    assert.equal(sonCriteriosIncompatibles("sin huecos", "más créditos"), false);
  });

  it("normaliza duplicados y conserva el primer criterio de pares incompatibles", () => {
    assert.deepEqual(
      normalizarCriteriosOrdenamiento([
        "más créditos",
        "sin huecos",
        "menos créditos",
        "sin huecos",
      ]),
      ["más créditos", "sin huecos"],
    );
  });
});
