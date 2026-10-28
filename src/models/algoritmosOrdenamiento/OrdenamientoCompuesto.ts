import Horario from "@/models/Horario";
import OrdenamientoHorarios from "@/models/algoritmosOrdenamiento/OrdenamientoHorarios";

export default class OrdenamientoCompuesto implements OrdenamientoHorarios {
  constructor(private readonly criterios: OrdenamientoHorarios[]) {}

  ordernar(horarios: Horario[]): void {
    for (let indice = this.criterios.length - 1; indice >= 0; indice--) {
      this.criterios[indice].ordernar(horarios);
    }
  }
}
