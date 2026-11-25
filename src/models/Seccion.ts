import Curso from './Curso';
import Profesor from './Profesor';
import BloqueTiempo from './BloqueTiempo';

export default  class Seccion {
  nrc: number;
  seccion: string;
  titulo: string;
  cuposMaximos: number;
  cuposTomados: number;
  modalidad: string;
  fechaInicio: Date;
  fechaFin: Date;
  curso: Curso;
  profesores: Profesor[] = [];
  horarios: BloqueTiempo[] = [];
  periodo: string;
  ptrm: string;
  duracion: string;
  // Identificador para poder diferenciar secciones con el mismo NRC pero en diferentes períodos
  idUnico: string; 

  constructor(nrc: number, seccion: string, titulo: string, cuposMaximos: number, cuposTomados: number, modalidad: string, fechaInicio: Date, fechaFin: Date, curso: Curso, duracion:string, periodo: string, ptrm: string = "", profesores: Profesor[] = [], horarios: BloqueTiempo[] = []) {
    this.nrc = nrc;
    this.seccion = seccion;
    this.titulo = titulo;
    this.cuposMaximos = cuposMaximos;
    this.cuposTomados = cuposTomados;
    this.modalidad = modalidad;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.curso = curso;
    this.profesores = profesores;
    this.horarios = horarios;
    this.duracion = duracion;
    this.periodo = periodo;
    this.ptrm = ptrm;
    this.idUnico = `${nrc}_${periodo}_${seccion}`;
  }
}
