import BloqueSeleccion from "../../src/models/BloqueSeleccion";

describe("BloqueSeleccion Class", () => {
   it("crea una instancia de BloqueTiempo con los atributos correctos", () => {
      const secciones = [jest.mock("../../src/models/Seccion")];
      const bloquesLibres = [jest.mock("../../src/models/BloqueTiempo")];

      const bloqueSeleccion = new BloqueSeleccion(secciones, bloquesLibres);

      expect(bloqueSeleccion.secciones).toBe(secciones);
      expect(bloqueSeleccion.bloquesLibres).toBe(bloquesLibres);
   });
});