/*
    Este archivo contiene las interfaces de los datos que se obtienen de la API extera de oferta de cursos
*/

/*
  Interfaz de los horarios (schedules) de una sección
*/
export interface HorarioAPI {
    classroom: string;
    time_ini: number;
    time_fin: number;
    date_ini: string;
    date_fin: string;
    l: string | null;
    m: string | null;
    i: string | null;
    j: string | null;
    v: string | null;
    s: string | null;
    d: string | null;
  }

/*
  Interfaz de los profesores (instructors) de una sección
*/
export interface ProfesorAPI {
  name: string;
}

/*
  Interfaz de una sección de un curso
*/
export interface SeccionAPI {
  nrc: number;
  section: string;
  title: string;
  maxenrol: number;
  enrolled: number;
  campus: string;
  schedules: HorarioAPI[];
  instructors: ProfesorAPI[];
  class: string;
  course: string;
  credits: number;
  attr: {[code : string]: string}[]
  ptrm: string;
}