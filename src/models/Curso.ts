import Seccion from './Seccion';

export default  class Curso {
  programa: string;
  curso: string;
  creditos: number;
  atributos: string[] = [];
  descripcion: string;
  secciones: Seccion[] = [];

  constructor(programa: string, curso: string, creditos: number, atributos: string[] = [], descripcion: string) {
    this.programa = programa;
    this.curso = curso;
    this.creditos = creditos;
    this.atributos = atributos;
    this.descripcion = descripcion;
  }
}
