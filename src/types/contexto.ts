/*
  Este archivo define las interfaces que se utilizan en los contextos (context) de la aplicación
  Estas interfaces definen los estados y funciones que se comparten entre los componentes
*/


import BloqueTiempo from "@/models/BloqueTiempo";
import Seccion from "@/models/Seccion";

/*
  Interfaz que define los estados y funciones que se comparten entre los componentes de la aplicación
  Guarda los cursos filtrados por atributos
*/
export interface CursosPorAtributos {
  cursosPorAtributos: { [atributo: string]: Seccion[] },
  setCursosPorAtributos: (cursos: { [atributo: string]: Seccion[] }) => void
}

/*
  Interfaz que define los estados y funciones que se comparten entre los componentes de la página de cursos
  Por ejemplo, es posible que se quiera buscar un curso planeado por el usuario y que se muestre en la sección de cursos consultados
  o que se quiera guardar una sección de un curso consultado en la sección de cursos planeados
*/
export interface EstadosCursos {
  cursosGuardados: { [codigo: string]: number[] },
  setCursosGuardados: (cursos: { [codigo: string]: number[] }) => void,
  cursoABuscar: string,
  setCursoABuscar: (curso: string) => void
}

/*
  Interfaz que define los estados y funciones que se comparten entre los componentes de la página de bloques
  Por ejemplo, es posible que se quiera guardar un bloque de tiempo en la lista de bloques guardados
*/
export interface EstadoBloques {
  bloqueEnCreacion: BloqueTiempo,
  setBloqueEnCreacion: (bloque: BloqueTiempo) => void
  bloquesGuardados: { [nombre: string]: BloqueTiempo[] }
  setBloquesGuardados: (bloques: { [nombre: string]: BloqueTiempo[] }) => void
}

