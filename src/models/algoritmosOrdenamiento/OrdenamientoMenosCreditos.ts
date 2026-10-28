import Horario from "@/models/Horario";
import OrdenamientoHorarios from "@/models/algoritmosOrdenamiento/OrdenamientoHorarios";

export default class OrdenamientoMenosCreditos implements OrdenamientoHorarios {
  /**
   * Ordena los horarios desde el menor hasta el mayor total de créditos.
   * @param horarios Horarios que se ordenarán en el lugar.
   * @returns No retorna un valor; modifica el orden del arreglo recibido.
   */
  ordernar(horarios: Horario[]): void {
    horarios.sort((a, b) => a.creditosTotales - b.creditosTotales);
  }
}
