import Curso from "../../src/models/Curso";

describe('Curso Class', () => {
    it("crea instancia de Curso con programa, curso, creditos, atributos, decripcion y secciones", () => {
        const programa = "MSIN";
        const cursoString = "4211";
        const creditos = 4;
        const atributos = ["Tipo E", "Tipo Epsilon"];
        const descripcion = "Lorem Ipsum";

        const curso = new Curso(programa, cursoString, creditos, atributos, descripcion);

        expect(curso.programa).toBe((programa));
        expect(curso.curso).toBe(cursoString);
        expect(curso.creditos).toBe(creditos);
        expect(curso.atributos).toBe(atributos);
        expect(curso.descripcion).toBe(descripcion);
        // No hay necesidad de verificar que sea del tipo correcto con el tipado fuerte de TypeScript
        expect(curso.secciones).toBeDefined();
    })
})