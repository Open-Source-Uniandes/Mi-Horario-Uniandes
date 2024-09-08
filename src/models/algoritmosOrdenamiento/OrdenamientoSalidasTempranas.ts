import OrdenamientoHorarios from '@/models/algoritmosOrdenamiento/OrdenamientoHorarios';
import Horario from '@/models/Horario';
import BloqueTiempo from '../BloqueTiempo';

export default class OrdenamientoSalidasTempranas implements OrdenamientoHorarios{
  ordernar(horarios: Horario[]): void {
    horarios.sort((a, b) => {
      return this.sumaHorasSalida(a) - this.sumaHorasSalida(b);
    });
  }

  /*
    Calcula la suma de las horas de salida de un horario dado.

    @param horario - El horario para el cual se calculará el total de horas de salida.
    @return La suma de las horas de salida en minutos.
  */
  private sumaHorasSalida(horario: Horario): number {
    return horario.secciones.reduce((total, seccion) => {
      return total + this.maxHoraFin(seccion.horarios);
    }, 0);
  }

  /*
    Calcula la hora de salida más tardia de una seccion dada.

    @param bloques - Los bloques de tiempo de un dia especifico.
    @return El tiempo de salida mas tarde en minutos.
  */
  private maxHoraFin(bloques: BloqueTiempo[]): number {
    return bloques.reduce((max, bloque) => Math.max(max, bloque.horaFin), 0);
  }
}