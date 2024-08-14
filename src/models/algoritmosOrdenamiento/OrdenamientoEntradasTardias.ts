import OrdenamientoHorarios from '@/models/algoritmosOrdenamiento/OrdenamientoHorarios';
import Horario from '@/models/Horario';

export default class OrdenamientoEntradasTardias implements OrdenamientoHorarios{
  ordernar(horarios: Horario[]): void {
    horarios.sort((a, b) => {
      return this.sumaHorasEntrada(b) - this.sumaHorasEntrada(a);
    });
  }
  
  private sumaHorasEntrada(horario: Horario): number {
    return horario.secciones.reduce((total, seccion) => {
      return total + this.minHoraInicio(seccion.horarios);
    }, 0);
  }
  
  private minHoraInicio(bloques: { horaInicio: number }[]): number {
    return bloques.reduce((min, bloque) => Math.min(min, bloque.horaInicio), 24*60);
  }
}