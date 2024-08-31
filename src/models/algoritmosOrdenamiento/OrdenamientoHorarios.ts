import Horario from '@/models/Horario';
export default interface OrdenamientoHorarios {
    ordernar(horarios: Horario[]) : void;
  }