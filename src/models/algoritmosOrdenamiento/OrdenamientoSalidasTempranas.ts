import OrdenamientoHorarios from '@/models/algoritmosOrdenamiento/OrdenamientoHorarios';
import Horario from '@/models/Horario';

export default class OrdenamientoSalidasTempranas implements OrdenamientoHorarios{
  ordernar(horarios: Horario[]): void {
    horarios.sort((a, b) => {
      return this.sumaHorasSalida(a) - this.sumaHorasSalida(b);
    });
  }

  private sumaHorasSalida(horario: Horario): number {
    return horario.secciones.reduce((total, seccion) => {
      return total + this.maxHoraFin(seccion.horarios);
    }, 0);
  }

  private maxHoraFin(bloques: { horaFin: number }[]): number {
    return bloques.reduce((max, bloque) => Math.max(max, bloque.horaFin), 0);
  }
}