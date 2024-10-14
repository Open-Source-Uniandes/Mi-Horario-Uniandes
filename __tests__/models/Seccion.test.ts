import Seccion from "../../src/models/Seccion";

describe("Seccion Class", () => {
   it("crea instancia de Seccion con atributos correctos", () => {
       const nrc = 12345;
       const seccionString = "Nombre sección";
       const titulo = "Nombre título";
       const cuposMaximos = 20;
       const cuposTomados = 15;
       const modalidad = "Virtual";
       const fechaInicio = new Date(2023, 0O1, 24);
       const fechaFin = new Date(2023, 0O5, 31);
       const curso = jest.mock('../../src/models/Curso');
       const profesores = [jest.mock("../../src/models/Profesor")];
       const horarios = [jest.mock("../../src/models/BloqueTiempo")];
       const periodo = "202310";

       const seccion = new Seccion(nrc, seccionString, titulo, cuposMaximos, cuposTomados, modalidad, fechaInicio, fechaFin, curso, periodo, profesores, horarios);

       expect(seccion.nrc).toBe(nrc);
       expect(seccion.seccion).toBe(seccionString);
       expect(seccion.titulo).toBe(titulo);
       expect(seccion.curso).toBe(curso);
       expect(seccion.fechaInicio).toBe(fechaInicio);
       expect(seccion.fechaFin).toBe(fechaFin);
       expect(seccion.curso).toBe(curso);
       expect(seccion.profesores).toBe(profesores);
       expect(seccion.horarios).toBe(horarios);
       expect(seccion.periodo).toBe(periodo);
   });
});