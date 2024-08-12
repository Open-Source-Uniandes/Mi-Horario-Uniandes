export default  class BloqueTiempo {
  ocupado: number;
  lugar: string;
  titulo: string;

  // TODO: No aun en los diagramas, falta revision
  dias: string[];
  horaInicio: number;
  horaFin: number;

  constructor(ocupado: number, lugar: string, titulo: string, dias: string[], horaInicio: number, horaFin: number) {
    this.ocupado = ocupado;
    this.lugar = lugar;
    this.titulo = titulo;
    this.dias = dias;
    this.horaInicio = horaInicio;
    this.horaFin = horaFin;
  }
}