import Horario from "@/models/Horario";
import BloqueTiempo from "@/models/BloqueTiempo";
import AlgoritmoProductoCartesiano from "@/models/algoritmosCreacion/AlgoritmoProductoCartesiano";
import { obtenerDatosCursosGuardados } from "./fetcher";
import OrdenamientoHorarios from "@/models/algoritmosOrdenamiento/OrdenamientoHorarios";
import { obtenerAlgoritmoOrdenamiento } from "./almacenamiento/almacenamientoCriterio";
import { obtenerBloquesGuardados } from "./almacenamiento/almacenamientoBloques";

/*
  Función que verifica si un horario es válido

  @param horario El horario a verificar
*/
export function horarioEsValido(horario: Horario) {
  const bloquesPorDia: {[dia:string]: BloqueTiempo[]} = {};
  const bloquesUsuario: {[tituloBloque:string]: BloqueTiempo[]} = obtenerBloquesGuardados();


  horario.secciones.forEach(seccion => {
    seccion.horarios.forEach(bloque => {
      bloque.dias.forEach(dia => {
        if (!bloquesPorDia[dia]) bloquesPorDia[dia] = [];
        bloquesPorDia[dia].push(bloque);
      });
    });
  });

  Object.values(bloquesUsuario).forEach(bloques => {
    bloques.forEach(bloque => {
      bloque.dias.forEach(dia => {
        if (!bloquesPorDia[dia]) bloquesPorDia[dia] = [];
        bloquesPorDia[dia].push(bloque);
      });
    });
  });
  for (const dia in bloquesPorDia) {
    bloquesPorDia[dia].sort((bloque1, bloque2) => bloque1.horaInicio - bloque2.horaInicio);
    for (let i = 1; i < bloquesPorDia[dia].length; i++) {
      if ( bloquesPorDia[dia][i - 1].horaFin > bloquesPorDia[dia][i].horaInicio) return false;
  }
}
return true;
}

/*
  Función que genera horarios a partir de los cursos guardados
*/
export async function generarHorarios(){
  const algoritmoCreacion = new AlgoritmoProductoCartesiano();
  const cursos = await obtenerDatosCursosGuardados();
  const horarios = algoritmoCreacion.crearHorarios(cursos);
  const algoritmoOrdenamiento: OrdenamientoHorarios = obtenerAlgoritmoOrdenamiento();
  algoritmoOrdenamiento.ordernar(horarios);
  return horarios;
}
