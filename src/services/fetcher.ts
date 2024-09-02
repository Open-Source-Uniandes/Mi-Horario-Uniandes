import Curso from '@/models/Curso';
import Seccion from '@/models/Seccion';
import Profesor from '@/models/Profesor';
import BloqueTiempo from '@/models/BloqueTiempo';
import { HorarioAPI, ProfesorAPI, SeccionAPI } from '@/types/ofertaDeCursosAPI'
import { obtenerCursosGuardados } from './almacenamiento/almacenamientoCursos';
import { obtenerPlanGuardado } from './almacenamiento/almacenamientoPlanes';
import Horario from '@/models/Horario';

const API = 'https://ofertadecursos.uniandes.edu.co/api/courses';
const API_POR_CURSO = (codigoCurso: string) => API + '?term=&ptrm=&prefix=&attr=&nameInput=' + codigoCurso.toUpperCase();
const API_POR_ATRIBUTO = (atributo: string) => API + '?term=&ptrm=&prefix=&attr=&nameInput=&campus=&attrs=' + atributo.toUpperCase() + '&timeStart=&offset=0&limit=25';
const API_POR_ATRIBUTO_Y_PROGRAMA = (atributo: string, programa: string) => API + '?term=&ptrm=&prefix=' + programa.toUpperCase() + '&attr=&nameInput=&campus=&attrs=' + atributo.toUpperCase() + '&timeStart=&offset=0&limit=25';
/*
  Función que carga los horarios de una sección

  @param seccion La sección a la que se le cargarán los horarios
  @param horarios Los horarios a cargar
*/
function cargarHorariosSeccion(seccion: Seccion, horarios: HorarioAPI[]) {
  for (let horario of horarios) {
    let diasDondeAplica: string[] = [];
    for (let dia of "lmijvs") {
      if (horario[dia as keyof HorarioAPI]) {
        diasDondeAplica.push(dia);
      }
    }
    let bloqueTiempo = new BloqueTiempo(0, horario.classroom, seccion.titulo, diasDondeAplica, horario.time_ini, horario.time_fin);
    seccion.horarios.push(bloqueTiempo);
  }
}

/*
  Función que carga los profesores de una sección

  @param seccion La sección a la que se le cargarán los profesores
  @param profesores Los profesores a cargar
*/
function cargarProfesoresSeccion(seccion: Seccion, profesores: ProfesorAPI[]) {
  for (let profesor of profesores) {
    seccion.profesores.push(new Profesor(profesor.name));
  }
}

/*
  Función que obtiene el periodo de una sección (8A, 8B, Completo, etc)

  @param seccion La sección de la que se obtendrá el periodo
*/
function obtenerPeriodoSeccion(seccion: SeccionAPI) {
  let periodo: string = "16";
  if (seccion.ptrm === "8A" || seccion.ptrm === "8B") {
    periodo = seccion.ptrm;
  }
  return periodo;
}

/*
  Función que crea una sección de un curso

  @param curso El curso al que pertenece la sección
  @param informacionSeccion La información de la sección
*/
function crearSeccionDeCurso(curso: Curso, informacionSeccion: SeccionAPI) {
  let seccion = new Seccion(informacionSeccion.nrc, informacionSeccion.section, informacionSeccion.title, informacionSeccion.maxenrol, informacionSeccion.enrolled, informacionSeccion.campus, new Date(informacionSeccion.schedules[0].date_ini), new Date(informacionSeccion.schedules[0].date_fin), curso, obtenerPeriodoSeccion(informacionSeccion));
  cargarProfesoresSeccion(seccion, informacionSeccion.instructors);
  cargarHorariosSeccion(seccion, informacionSeccion.schedules);
  return seccion;
}

/*
  Función que crea los cursos a partir de una petición a la API de la universidad

  @param ruta La ruta a la que se le hará la petición
*/
export async function crearCursosAPartirDePeticion(ruta: string){
  const respuesta = await fetch(ruta);
  const data = await respuesta.json();
  const cursosEncontrados: { [codigoCurso: string]: Curso } = {};

  data.map((informacionSeccion: SeccionAPI) => {
    let codigoCurso = informacionSeccion.class + informacionSeccion.course;
    if (!(codigoCurso in cursosEncontrados)) {
      cursosEncontrados[codigoCurso] = new Curso(informacionSeccion.class, informacionSeccion.course, informacionSeccion.credits, informacionSeccion.attr.map( atributo => atributo["code"]), informacionSeccion.title);
    }
    let seccion = crearSeccionDeCurso(cursosEncontrados[codigoCurso], informacionSeccion);
    cursosEncontrados[codigoCurso].secciones.push(seccion);
  });
  return cursosEncontrados;
}

/*
  Función que busca un curso en la API de la universidad

  @param nombreCursoABuscar El nombre del curso a buscar
*/
export async function buscarCurso(nombreCursoABuscar: string) {
  return await crearCursosAPartirDePeticion(API_POR_CURSO(nombreCursoABuscar));
}

export const atributosEspeciales: string[] = ["EPSI", "INGL", "ECUR", "BLEND", "SEMP", "VIRT"];

export const programasEspeciales: string[] = ["CBCA", "CBCO", "CBPC", "CBCC", "DEPO"]


/*
  Función que obtiene las secciones de un atributo y programa

  @param atributo El atributo a buscar
*/
export async function obtenerSeccionesPorAtributoYPrograma(atributo: string, programa: string) {
  const seccionesAPI: SeccionAPI[] = await fetch(API_POR_ATRIBUTO_Y_PROGRAMA(atributo, programa)).then(response => response.json());
  const secciones = seccionesAPI.map(seccionAPI => crearSeccionDeCurso(new Curso(seccionAPI.class, seccionAPI.course, seccionAPI.credits, seccionAPI.attr.map( atributo => atributo["code"]), seccionAPI.title), seccionAPI));
  return secciones;
}

/*
  Función que obtiene la información de los cursos guardados por el usuario

  @returns Los cursos guardados por el usuario
*/
async function obtenerCursosAPartirDeSecciones(cursosGuardados: { [codigoCurso: string]: string[] }) {
  const promesasCursosActualizados = Object.keys(cursosGuardados).map(nombreCurso => buscarCurso(nombreCurso));
  const cursosActualizados = await Promise.all(promesasCursosActualizados);
  let cursosPorNombre: {[codigoCurso: string]: Curso} = {};
  cursosActualizados.forEach(cursoActualizado => {
    Object.keys(cursoActualizado).forEach(codigoCurso => {
      if (!(codigoCurso in cursosPorNombre) && (codigoCurso in cursosGuardados)) {
        cursosPorNombre[codigoCurso] = cursoActualizado[codigoCurso];
      }
    });
  });
  const cursos = Object.values(cursosPorNombre);
  cursos.forEach(curso => {
    curso.secciones = curso.secciones.filter(seccion => cursosGuardados[curso.programa + curso.curso].includes(seccion.seccion));
  });
  return cursos;
}


/*
  Función que obtiene la información de los cursos guardados por el usuario

  @returns Los cursos guardados por el usuario
*/
async function obtenerCursosAPartirDeNRC(cursosGuardados: { [codigoCurso: string]: number }) {
  const promesasCursosActualizados = Object.keys(cursosGuardados).map(nombreCurso => buscarCurso(nombreCurso));
  const cursosActualizados = await Promise.all(promesasCursosActualizados);
  const cursos = cursosActualizados.map(curso => Object.values(curso)[0]);
  cursos.forEach(curso => {
    curso.secciones = curso.secciones.filter(seccion => cursosGuardados[curso.programa + curso.curso] === seccion.nrc);
  });
  return cursos;
}


/*
  Función que obtiene la información de los cursos guardados por el usuario

  @returns Los cursos guardados por el usuario
*/
export async function obtenerDatosCursosGuardados() {
  return obtenerCursosAPartirDeSecciones(obtenerCursosGuardados());
}

/*
  Función que obtiene la información de los cursos guardados por el usuario en un plan

  @param planId El id del plan a obtener
  @return Los cursos guardados por el usuario en el plan
*/
export async function obtenerHorarioAPartirDePlan(planId: number) {
  const cursos = await obtenerCursosAPartirDeNRC(obtenerPlanGuardado(planId));
  const cursosASeccion = cursos.map(curso => curso.secciones[0]);
  const horario = new Horario(1,cursosASeccion);
  return horario;
}