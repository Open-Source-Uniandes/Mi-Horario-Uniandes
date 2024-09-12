import Horario from "../../src/models/Horario";
import Seccion from "../../src/models/Seccion";

describe("Horario Class", () => {
    it("crea instancia de Horario con atributos correctos", () => {
       const id = 123;
       const secciones = [jest.mock("../../src/models/Seccion")]

       const horario = new Horario(id, secciones);

       expect(horario.id).toBe(id);
       expect(horario.secciones).toBe(secciones);
    });
});