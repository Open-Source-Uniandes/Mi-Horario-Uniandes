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

  constructor(nrc: number, seccion: string, titulo: string, cuposMaximos: number, cuposTomados: number, modalidad: string, fechaInicio: Date, fechaFin: Date, curso: Curso, profesores: Profesor[] = [], horarios: BloqueTiempo[] = []) {
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
  }
}
