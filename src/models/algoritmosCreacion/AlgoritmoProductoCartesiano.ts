import AlgoritmoCreacionHorarios from "./AlgoritmoCreacionHorarios";
import Horario from "../Horario";
import Seccion from "../Seccion";
import Curso from "../Curso";
import {horarioEsValido} from "@/services/operacionesSobreHorario";
import { obtenerBloquesGuardados } from "@/services/almacenamiento/almacenamientoBloques";

export default class AlgoritmoProductoCartesiano implements AlgoritmoCreacionHorarios {
  crearHorarios(cursos: Curso[]): Horario[] {
    const seccionesPorCurso = cursos.map(curso => curso.secciones);
    const combinacionesSeccionesDeCurso = seccionesPorCurso.reduce<Seccion[][]>((combinaciones, cursoActual) => {return combinaciones.flatMap(a => cursoActual.map(c => [...a, c]));}, [[]]);
    const horarios = combinacionesSeccionesDeCurso.map((combinacion,index) => new Horario(index,combinacion)).filter(horario => horarioEsValido(horario));
    return horarios;
  }
}