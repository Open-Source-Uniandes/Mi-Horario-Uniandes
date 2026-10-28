import Horario from "@/models/Horario";
import OrdenamientoHorarios from "@/models/algoritmosOrdenamiento/OrdenamientoHorarios";

export default class OrdenamientoCreditos implements OrdenamientoHorarios {
  ordernar(horarios: Horario[]): void {
    horarios.sort((a, b) => b.creditosTotales - a.creditosTotales);
  }
}
