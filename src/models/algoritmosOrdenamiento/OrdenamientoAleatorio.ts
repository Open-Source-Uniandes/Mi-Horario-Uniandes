import OrdenamientoHorarios from '@/models/algoritmosOrdenamiento/OrdenamientoHorarios';
import Horario from '@/models/Horario';
export default class OrdenamientoAleatorio implements OrdenamientoHorarios{
  ordernar(horarios: Horario[]) : void {
    horarios.sort(() => Math.random() - 0.5);
  }
}