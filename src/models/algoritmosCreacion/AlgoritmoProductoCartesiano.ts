import AlgoritmoCreacionHorarios from "./AlgoritmoCreacionHorarios";
import Horario from "../Horario";
import Seccion from "../Seccion";
import Curso from "../Curso";
import {eliminarComplementariaSiNoSonNecesarias, horarioEsValido} from "@/services/operacionesSobreHorario";

export default class AlgoritmoProductoCartesiano implements AlgoritmoCreacionHorarios {
  crearHorarios(cursos: Curso[]): Horario[] {
    const seccionesPorCurso = cursos.map(curso => curso.secciones);

    const combinacionesSeccionesDeCurso = seccionesPorCurso.reduce<Seccion[][]>(
      (combinaciones, cursoActual) => 
        combinaciones.flatMap(a => cursoActual.map(c => [...a, c])),
      [[]]
    );
    const horariosSinComplementarias = combinacionesSeccionesDeCurso.map(
      eliminarComplementariaSiNoSonNecesarias
    );
    const vistos = new Set<string>();
    const horarios: Horario[] = [];

    for (const combinacion of horariosSinComplementarias) {
      const horario = new Horario(0, combinacion);
      if (!horarioEsValido(horario)) continue;
      const clave = combinacion.map(s => s.nrc).sort((a, b) => a - b).join("-");
      if (!vistos.has(clave)) {
        vistos.add(clave);
        horarios.push(horario);
      }
    }
    return horarios.map((h, i) => new Horario(i, h.secciones));
  }
}
