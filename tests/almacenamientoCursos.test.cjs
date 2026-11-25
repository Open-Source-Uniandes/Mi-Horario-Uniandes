const assert = require("node:assert/strict");
const { afterEach, describe, it } = require("node:test");
const {
  añadirVariasSeccionesDeCurso,
  guardarSeccionDeCurso,
  obtenerCursosGuardados,
} = require("../.test-dist/almacenamiento/almacenamientoCursos.js");

function prepararLocalStorage(contenido = {}) {
  const datos = new Map([["cursos", JSON.stringify(contenido)]]);
  global.window = {};
  global.localStorage = {
    getItem: (clave) => datos.get(clave) || null,
    setItem: (clave, valor) => datos.set(clave, valor),
  };
  return datos;
}

afterEach(() => {
  delete global.window;
  delete global.localStorage;
});

describe("almacenamiento de cursos", () => {
  it("persiste el período y evita guardar cursos de otro período", () => {
    const datos = prepararLocalStorage();

    assert.equal(añadirVariasSeccionesDeCurso("BIOL1101", ["101_202710_01"], "202710"), true);
    assert.equal(guardarSeccionDeCurso("QUIM1200", "202_202711_01", "202711"), false);
    assert.deepEqual(JSON.parse(datos.get("cursos")), {
      BIOL1101: { periodo: "202710", secciones: ["101_202710_01"] },
    });
  });

  it("migra cursos antiguos sin perder selecciones de varios períodos", () => {
    const datos = prepararLocalStorage({
      BIOL1101: ["101_202710_01", "102_202711_02", "103_202710_03"],
    });

    assert.deepEqual(obtenerCursosGuardados(), {
      BIOL1101: { periodo: "", secciones: ["101_202710_01", "102_202711_02", "103_202710_03"] },
    });
    assert.deepEqual(JSON.parse(datos.get("cursos")), {
      BIOL1101: { periodo: "", secciones: ["101_202710_01", "102_202711_02", "103_202710_03"] },
    });
    assert.equal(añadirVariasSeccionesDeCurso("QUIM1200", ["202_202710_01"], "202710"), false);
  });
});
