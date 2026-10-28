import AlgoritmoCreacionHorarios from "./AlgoritmoCreacionHorarios";
import Horario from "../Horario";
import Seccion from "../Seccion";
import Curso from "../Curso";
import {eliminarComplementariaSiNoSonNecesarias, horarioEsValido} from "@/services/operacionesSobreHorario";
import { generarCombinacionesDeCursos } from "@/services/operacionesGrupos";

export default class AlgoritmoProductoCartesiano implements AlgoritmoCreacionHorarios {
  crearHorarios(cursos: Curso[], grupos: string[][] = []): Horario[] {
    const combinacionesDeCursos = generarCombinacionesDeCursos(cursos, grupos);
    const combinacionesSeccionesDeCurso = combinacionesDeCursos.flatMap((combinacion) =>
      combinacion.reduce<Seccion[][]>(
        (opciones, cursoActual) =>
          opciones.flatMap((opcion) =>
            cursoActual.secciones.map((seccion) => [...opcion, seccion]),
          ),
        [[]],
      ),
    );
    const horariosSinComplementarias = combinacionesSeccionesDeCurso.map(
      eliminarComplementariaSiNoSonNecesarias
    );
    const vistos = new Set<string>();
    const horarios: Horario[] = [];

    for (const combinacion of horariosSinComplementarias) {
      const horario = new Horario(0, combinacion);
      if (!horarioEsValido(horario)) continue;
      const clave = combinacion.map((seccion) => seccion.idUnico).sort().join("-");
      if (!vistos.has(clave)) {
        vistos.add(clave);
        horarios.push(horario);
      }
    }
    return horarios.map((h, i) => new Horario(i, h.secciones));
  }
}
