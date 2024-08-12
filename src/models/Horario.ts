import Seccion from "./Seccion";

export default  class Horario {
  id: number;
  secciones: Seccion[] = [];

  constructor(id: number, bloquesSeleccion: Seccion[]) {
    this.id = id;
    this.secciones = bloquesSeleccion;
  }
}
