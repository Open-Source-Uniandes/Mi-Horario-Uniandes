import Horario from "../Horario";
import Curso from "../Curso";

export default interface AlgoritmoCreacionHorarios {
    crearHorarios(cursos: Curso[]) : Horario[];
}