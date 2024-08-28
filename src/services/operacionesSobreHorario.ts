import Horario from "@/models/Horario";
import BloqueTiempo from "@/models/BloqueTiempo";
import AlgoritmoProductoCartesiano from "@/models/algoritmosCreacion/AlgoritmoProductoCartesiano";
import { obtenerDatosCursosGuardados } from "./fetcher";
import OrdenamientoHorarios from "@/models/algoritmosOrdenamiento/OrdenamientoHorarios";
import { obtenerAlgoritmoOrdenamiento } from "./almacenamiento/almacenamientoCriterio";
import { obtenerBloquesGuardados } from "./almacenamiento/almacenamientoBloques";
import Seccion from "@/models/Seccion";

/*
  Función que verifica si un horario es válido

  @param horario El horario a verificar
*/
export function horarioEsValido(horario: Horario) {
  const bloquesPorDiaTotal: {[dia:string]: BloqueTiempo[]}= obtenerBloquesTotales(horario);
  for (const dia in bloquesPorDiaTotal) {
    console.log(dia, bloquesPorDiaTotal[dia]);
    for (let i = 1; i < bloquesPorDiaTotal[dia].length; i++) {
      if ( Number(bloquesPorDiaTotal[dia][i - 1].horaFin) > Number(bloquesPorDiaTotal[dia][i].horaInicio)) return false;
    }
  }
  return true;
}

/*
  Función que une los bloques por día de un horario con los bloques por día de un usuario

  @param bloquesPorDia Los bloques por día del horario
  @param bloquesPorDiaUsuario Los bloques por día del usuario
*/
function obtenerBloquesTotales(horario: Horario) {
  const bloquesPorDia: {[dia:string]: BloqueTiempo[]} = obtenerBloquesPorDia(horario);
  const bloquesUsuario: {[tituloBloque:string]: BloqueTiempo[]} = obtenerBloquesPorDiaUsuario(obtenerBloquesGuardados());
  const bloquesPorDiaTotal: {[dia:string]: BloqueTiempo[]}= crearObjetoBloquesPorDia();
  const dias = Object.keys(bloquesPorDiaTotal);
  dias.forEach(dia => {
    bloquesPorDiaTotal[dia] = bloquesPorDia[dia] || [];
    bloquesPorDiaTotal[dia] = bloquesPorDiaTotal[dia].concat(bloquesUsuario[dia] || []);
  } );
  for (const dia in bloquesPorDiaTotal) {
    bloquesPorDiaTotal[dia].sort((bloque1, bloque2) => Number(bloque1.horaInicio) - Number(bloque2.horaInicio));
  }
  return bloquesPorDiaTotal;
}

/*
  Función que filtra las secciones que colisionan con las secciones de un horario

  @param horario El horario a comparar
  @param secciones Las secciones a filtrar
*/
export function filtrarSeccionesQueColisionan(horario: Horario, secciones: Seccion[]) {
  const bloquesPorDiaTotal: {[dia:string]: BloqueTiempo[]}= obtenerBloquesTotales(horario);
  return secciones.filter(seccion => {
    for (const horario of seccion.horarios) {
      for (const dia of horario.dias) {
        for (const bloque of bloquesPorDiaTotal[dia]) {
          if (horario.horaInicio < bloque.horaFin && horario.horaFin > bloque.horaInicio) return false;
        }
      }
    }
    return true;
  });
}


/*
  Función que crea un objeto con los bloques por día
  el sufijo 1 indica ciclo 1 (8A) y el sufijo 2 indica ciclo 2 (8B)
  si un bloque es de 16 semanas se guarda en ambos ciclos

  @returns Un objeto con los bloques por día
*/
function crearObjetoBloquesPorDia() {
  return {"l1":[], "m1":[], "i1":[], "j1":[], "v1":[], "s1":[],"l2":[], "m2":[], "i2":[], "j2":[], "v2":[], "s2":[] };
}

/*
  Función que obtiene los bloques por día de un horario

  @param horario El horario a obtener los bloques
*/
function obtenerBloquesPorDia(horario: Horario) {
  const bloquesPorDia: {[dia: string]: BloqueTiempo[]} = crearObjetoBloquesPorDia();
  horario.secciones.forEach(seccion => {
    seccion.horarios.forEach(bloque => {
      bloque.dias.forEach(dia => {
        if (seccion.periodo === "8A" || seccion.periodo === "16")
          bloquesPorDia[dia + "1"].push(bloque);
        if (seccion.periodo === "8B" || seccion.periodo === "16")
          bloquesPorDia[dia + "2"].push(bloque);
      });
    });
  });
  return bloquesPorDia;
}


/*
  Función que obtiene los bloques guardados

  @returns Los bloques guardados
*/
function obtenerBloquesPorDiaUsuario(bloquesGuardados: {[titulo: string]: BloqueTiempo[]}) {
  const bloquesPorDia: {[dia: string]: BloqueTiempo[]} = crearObjetoBloquesPorDia();
  Object.values(bloquesGuardados).forEach(bloques => {
    bloques.forEach(bloque => {
      bloque.dias.forEach(dia => {
        bloquesPorDia[dia + "1"].push(bloque);
        bloquesPorDia[dia + "2"].push(bloque);
      });
    });
  });
  return bloquesPorDia;
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
