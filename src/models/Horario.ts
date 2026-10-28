import Seccion from "./Seccion";
import { calcularCreditosTotales } from "@/services/operacionesGrupos";

export default  class Horario {
  id: number;
  secciones: Seccion[] = [];

  constructor(id: number, bloquesSeleccion: Seccion[]) {
    this.id = id;
    this.secciones = bloquesSeleccion;
  }

  get creditosTotales(): number {
    return calcularCreditosTotales(this.secciones);
  }
}
