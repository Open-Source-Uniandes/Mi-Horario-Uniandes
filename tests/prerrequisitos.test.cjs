const assert = require("node:assert/strict");
const { describe, it } = require("node:test");
const { interpretarExpresionDeRequisitos } = require("../.test-dist/prerrequisitos.js");

describe("interpretarExpresionDeRequisitos", () => {
  it("preserves AND/OR groups and course codes", () => {
    const resultado = interpretarExpresionDeRequisitos(
      " (ISIS 1221 O ISIS 1222) Y (MATE 1201 O MATE1  O MATS1 ) ",
      "Prerequisites description",
    );

    assert.deepEqual(resultado, {
      tipo: "y",
      descripcion: "Prerequisites description",
      hijos: [
        {
          tipo: "o",
          hijos: [
            { tipo: "curso", codigo: "ISIS 1221", descripcion: "" },
            { tipo: "curso", codigo: "ISIS 1222", descripcion: "" },
          ],
        },
        {
          tipo: "o",
          hijos: [
            { tipo: "curso", codigo: "MATE 1201", descripcion: "" },
            { tipo: "curso", codigo: "MATE1", descripcion: "" },
            { tipo: "curso", codigo: "MATS1", descripcion: "" },
          ],
        },
      ],
    });
  });

  it("uses standard AND precedence and falls back on unrecognized syntax", () => {
    assert.deepEqual(
      interpretarExpresionDeRequisitos("ISIS 1221 O ISIS 1222 Y MATE 1201", ""),
      {
        tipo: "o",
        descripcion: "",
        hijos: [
          { tipo: "curso", codigo: "ISIS 1221", descripcion: "" },
          {
            tipo: "y",
            hijos: [
              { tipo: "curso", codigo: "ISIS 1222", descripcion: "" },
              { tipo: "curso", codigo: "MATE 1201", descripcion: "" },
            ],
          },
        ],
      },
    );
    assert.deepEqual(interpretarExpresionDeRequisitos("ISIS 1221 + MATE 1201", "raw text"), {
      tipo: "sin-interpretar",
      codigo: "ISIS 1221 + MATE 1201",
      descripcion: "raw text",
    });
  });

  it("matches course names from a description with the same AND/OR structure", () => {
    const resultado = interpretarExpresionDeRequisitos(
      "MATE 1201 Y (ISIS 1201 O ISIS 1202)",
      "Cálculo diferencial Y (Introducción a sistemas O Fundamentos de software)",
    );

    assert.deepEqual(resultado, {
      tipo: "y",
      descripcion: "Cálculo diferencial Y (Introducción a sistemas O Fundamentos de software)",
      hijos: [
        { tipo: "curso", codigo: "MATE 1201", descripcion: "Cálculo diferencial" },
        {
          tipo: "o",
          hijos: [
            { tipo: "curso", codigo: "ISIS 1201", descripcion: "Introducción a sistemas" },
            { tipo: "curso", codigo: "ISIS 1202", descripcion: "Fundamentos de software" },
          ],
        },
      ],
    });
  });

  it("matches names with explicit grouping in the description", () => {
    const resultado = interpretarExpresionDeRequisitos(
      "ISIS 1201 O ISIS 1202 Y MATE 1201",
      "Algoritmos O (cálculo Y álgebra)",
    );

    assert.deepEqual(resultado, {
      tipo: "o",
      descripcion: "Algoritmos O (cálculo Y álgebra)",
      hijos: [
        { tipo: "curso", codigo: "ISIS 1201", descripcion: "Algoritmos" },
        {
          tipo: "y",
          hijos: [
            { tipo: "curso", codigo: "ISIS 1202", descripcion: "cálculo" },
            { tipo: "curso", codigo: "MATE 1201", descripcion: "álgebra" },
          ],
        },
      ],
    });
  });

  it("keeps parentheses inside a course name while removing logical grouping", () => {
    const resultado = interpretarExpresionDeRequisitos(
      "(ISIS 1221 O ISIS 1222) Y (MATE 1201 O MATE1 O MATS1)",
      "(Introducción a la programación O Intro.programación(Honores)) Y (Precálculo O MATE1 O MATS1)",
    );

    assert.deepEqual(resultado.hijos[0].hijos, [
      { tipo: "curso", codigo: "ISIS 1221", descripcion: "Introducción a la programación" },
      { tipo: "curso", codigo: "ISIS 1222", descripcion: "Intro.programación(Honores)" },
    ]);
    assert.deepEqual(resultado.hijos[1].hijos, [
      { tipo: "curso", codigo: "MATE 1201", descripcion: "Precálculo" },
      { tipo: "curso", codigo: "MATE1", descripcion: "MATE1" },
      { tipo: "curso", codigo: "MATS1", descripcion: "MATS1" },
    ]);
  });

  it("does not mistake Y inside a course name for a logical operator", () => {
    const resultado = interpretarExpresionDeRequisitos(
      "ISIS 1201 O ISIS 1202 Y MATE 1201",
      "ARQUITECTURA Y DISEÑO O ANÁLISIS Y CÁLCULO",
    );

    assert.deepEqual(resultado.hijos[0], {
      tipo: "curso",
      codigo: "ISIS 1201",
      descripcion: "ARQUITECTURA Y DISEÑO",
    });
    assert.deepEqual(resultado.hijos[1].hijos, [
      { tipo: "curso", codigo: "ISIS 1202", descripcion: "ANÁLISIS" },
      { tipo: "curso", codigo: "MATE 1201", descripcion: "CÁLCULO" },
    ]);
  });

  it("extracts titles from the API format used by ISIS 3007", () => {
    const resultado = interpretarExpresionDeRequisitos(
      "(ISIS 3204 O ISIS 2311) Y (ISIS 2007 O IIND 3312) Y (ISIS 2203 O ISIS 1311) Y (ISIS 2503 O ISIS 2212) Y (ISIS 2403 O ISIS 2411) Y (ISIS 2304 O ISIS 1511) Y (ISIS 1105 O ISIS 2112) Y (ISIS 1106 O ISIS 2111) Y MATE 1207 Y (IIND 2106 O (MATE 2510 Y MATE 3520) O (MATE 1252 Y MATE 1506) O (MATE 1252 Y MATE 1509)) Y (IIND 2401 O ADMI 2204) Y (FISI 1528 O FISI 1028) Y (LENG 1156 O LENG 3001 O RLEC1 O RLEN1 O INGL4 O ENGL7) Y (ESCR 1102 O CCOM 1100)",
      "(INFRAESTRUCTURA COMUNICACIÓNES O REDES SERVICIOS COMUNICACIONES) Y (DISEÑO PROD. E INNOVACIÓN TI O INNOVAC.EMPREND. EN INGE) Y (INFRAESTRUCTURA COMPUTACIONAL O TEC. E INFRAESTRUCTURA CÓMPUTO) Y (ARQUITECTURA Y DISEÑO DE SW O ARQUITECTURAS DE SOFTWARE ROBU) Y (ARQUITECTURA EMPRESARIAL O INGENIERÍA DE NEGOCIOS DIGITAL) Y (SISTEMAS TRANSACCIONALES O FUNDAMENTOS DE BASES DE DATOS) Y (DISEÑO Y ANÁLISIS DE ALGORI. O DISEÑO DE ALGORITMOS) Y (LENGUAJES Y MÁQUINAS O ELEMENTOS ESENCIALES LENG PROG) Y CÁLCULO VECTORIAL Y (PROBABILIDAD Y ESTADÍSTICA I O (PROBABILIDAD (HONOR) Y ESTADÍSTICA MATEMÁTICA 1) O (CÁLCULO INTEGRAL-PROBABILIDAD Y PROB.Y ESTADÍSTICA 2) O (CÁLCULO INTEGRAL-PROBABILIDAD Y PROB Y ESTADISTICA (REFORMADO))) Y (ANALIS.DECISIÓN INVERSIÓN O DECISIONES DE INVERSIÓN) Y (FÍSICA II O FÍSICA II) Y (ENGLISH 06 O REQUISITO C1 LENG. PRIN. O RLEC1 O RLEN1 O INGL4 O ENGL7) Y (ESCRITURA UNIVERSITARIA II O PENSAR, COMUNICAR Y COLABORAR)",
    );
    const cursos = [];
    const recopilar = (requisito) => {
      if (requisito.tipo === "curso") {
        cursos.push(requisito);
      } else if (requisito.tipo === "y" || requisito.tipo === "o") {
        requisito.hijos.forEach(recopilar);
      }
    };
    recopilar(resultado);

    assert.equal(cursos.length, 36);
    assert.equal(cursos.find((curso) => curso.codigo === "ISIS 2311").descripcion, "REDES SERVICIOS COMUNICACIONES");
    assert.equal(cursos.find((curso) => curso.codigo === "ISIS 2212").descripcion, "ARQUITECTURAS DE SOFTWARE ROBU");
    assert.equal(cursos.find((curso) => curso.codigo === "MATE 1207").descripcion, "CÁLCULO VECTORIAL");
    assert.equal(cursos.find((curso) => curso.codigo === "ISIS 1106").descripcion, "LENGUAJES Y MÁQUINAS");
  });
});
