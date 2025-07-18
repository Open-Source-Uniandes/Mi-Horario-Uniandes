import Horario from "@/models/Horario";
import BloqueTiempo from "@/models/BloqueTiempo";
import AlgoritmoProductoCartesiano from "@/models/algoritmosCreacion/AlgoritmoProductoCartesiano";
import { obtenerDatosCursosGuardados } from "./fetcher";
import OrdenamientoHorarios from "@/models/algoritmosOrdenamiento/OrdenamientoHorarios";
import { obtenerAlgoritmoOrdenamiento } from "./almacenamiento/almacenamientoCriterio";
import { obtenerBloquesGuardados } from "./almacenamiento/almacenamientoBloques";
import Seccion from "@/models/Seccion";
import AlgoritmoCreacionHorarios from "@/models/algoritmosCreacion/AlgoritmoCreacionHorarios";

/*
  Función que verifica si un horario es válido con base en los bloques de tiempo y secciones con letras

  @param horario El horario a verificar
*/
export function horarioEsValido(horario: Horario): boolean {
  const bloquesPorDiaTotal: {[dia:string]: BloqueTiempo[]}= obtenerBloquesTotales(horario);
  for (const dia in bloquesPorDiaTotal) {
    for (let i = 1; i < bloquesPorDiaTotal[dia].length; i++) {
      if ( Number(bloquesPorDiaTotal[dia][i - 1].horaFin) > Number(bloquesPorDiaTotal[dia][i].horaInicio)) return false;
    }
  }
  return complementariasSonValidas(horario);
}

/*
  Función que verifica si las secciones complementarias de un horario son válidas

  @param horario El horario a verificar
*/
function complementariasSonValidas(horario: Horario): boolean {
  const seccionPorCodigo = new Map<string, Seccion>();
  const letraRegex = /[a-zA-Z]/;

  horario.secciones.forEach(seccion => {
    const codigo = seccion.curso.programa + seccion.curso.curso;
    seccionPorCodigo.set(codigo, seccion);
  });

  for (const seccion of horario.secciones) {
    const esMagistral = seccion.curso.curso.length === 4;
    const comienzaConLetra = letraRegex.exec(seccion.seccion[0] ?? '');

    if (comienzaConLetra) {
      if (esMagistral && !cursoTieneComplementaria(seccion, seccionPorCodigo)) {
        return false;
      } 
      if (!esMagistral && !complementariaTieneMagistral(seccion, seccionPorCodigo)) {
        return false;
      }
    }
  }
  return true;
}

/*
  Función que obtiene los sufijos válidos para las secciones complementarias

  @returns Un array con los sufijos válidos
*/
function obtenerSufijosValidos() {
  return ['C', 'L', 'P', 'T'];
}


/*
  Función que verifica si un curso tiene una sección complementaria asociada

  @param seccion La sección a verificar
  @param secciones El mapa de secciones para buscar la complementaria
*/
function cursoTieneComplementaria(seccion: Seccion, secciones: Map<string, Seccion>): boolean {
  
  const baseCodigo = seccion.curso.programa + seccion.curso.curso;

  for (const sufijo of obtenerSufijosValidos()) {
    const codigoComplementaria = baseCodigo + sufijo;
    if (secciones.has(codigoComplementaria)) {
      return true;
    }
  }
  return false;
}

/*
  Función que verifica si una sección complementaria tiene una sección magistral asociada

  @param seccion La sección complementaria a verificar
  @param secciones El mapa de secciones para buscar la sección magistral
*/
function complementariaTieneMagistral(seccion: Seccion, secciones: Map<string, Seccion>): boolean {
  const codigoBase = (seccion.curso.programa + seccion.curso.curso).slice(0, 8);
  const principal = secciones.get(codigoBase);

  // si la seccion principal es un numero, tambien es valida
  return !!principal && seccion.seccion.startsWith(principal.seccion);
}

/*
  Función que une los bloques por día de un horario con los bloques por día de un usuario

  @param bloquesPorDia Los bloques por día del horario
  @param bloquesPorDiaUsuario Los bloques por día del usuario
*/
function obtenerBloquesTotales(horario: Horario) {
  const bloquesPorDia: {[dia:string]: BloqueTiempo[]} = obtenerBloquesPorDiaHorario(horario);
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
    let bloquesPorDiaSeccion = obtenerBloquesPorSeccion(seccion);
    for (const dia in bloquesPorDiaSeccion) {
      for (const bloqueSeccion of bloquesPorDiaSeccion[dia]) {
        for (const bloqueHorario of bloquesPorDiaTotal[dia]) {
          if (Number(bloqueSeccion.horaFin) > Number(bloqueHorario.horaInicio) && Number(bloqueSeccion.horaInicio) < Number(bloqueHorario.horaFin)) return false;
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
function obtenerBloquesPorDiaHorario(horario: Horario) {
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
  Función que obtiene los bloques por día de una sección

  @param seccion La sección a obtener los bloques
*/
function obtenerBloquesPorSeccion(seccion : Seccion){
  const bloquesPorDia: {[dia: string]: BloqueTiempo[]} = crearObjetoBloquesPorDia();
  seccion.horarios.forEach(bloque => {
    bloque.dias.forEach(dia => {
      if (seccion.periodo === "8A" || seccion.periodo === "16")
        bloquesPorDia[dia + "1"].push(bloque);
      if (seccion.periodo === "8B" || seccion.periodo === "16")
        bloquesPorDia[dia + "2"].push(bloque);
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
  Función que elimina una sección complementaria, laboratorio, trabajo asistido,etc si no es necesaria

  @param horario El horario a verificar
*/
export function eliminarComplementariaSiNoSonNecesarias(secciones: Seccion[]) {
  
  const seccionPorCodigo = new Map<string, Seccion>();
  const nrcsAEliminar = new Set<number>();

  secciones.forEach(seccion => {
    const codigo = seccion.curso.programa + seccion.curso.curso;
    seccionPorCodigo.set(codigo, seccion);
  });

  for (const seccion of secciones) {
    const esMagistral = seccion.curso.curso.length === 4;
    const esNumerica = /^\d+$/.test(seccion.seccion);
    if (esMagistral && esNumerica) {
      for (const sufijo of obtenerSufijosValidos()) {
        const codigoComplementaria = seccion.curso.programa + seccion.curso.curso + sufijo;
        if (seccionPorCodigo.has(codigoComplementaria)) {
          nrcsAEliminar.add(seccionPorCodigo.get(codigoComplementaria)!.nrc);
        }
      }
    }
  }
  return secciones.filter(seccion => !nrcsAEliminar.has(seccion.nrc));
}

/*
  Función que genera horarios a partir de los cursos guardados
*/
export async function generarHorarios(){
  const algoritmoCreacion: AlgoritmoCreacionHorarios = new AlgoritmoProductoCartesiano();
  const cursos = await obtenerDatosCursosGuardados();
  const horarios = algoritmoCreacion.crearHorarios(cursos);
  const algoritmoOrdenamiento: OrdenamientoHorarios = obtenerAlgoritmoOrdenamiento();
  algoritmoOrdenamiento.ordernar(horarios);
  return horarios;
}
