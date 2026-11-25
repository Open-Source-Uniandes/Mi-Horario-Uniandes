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
});
