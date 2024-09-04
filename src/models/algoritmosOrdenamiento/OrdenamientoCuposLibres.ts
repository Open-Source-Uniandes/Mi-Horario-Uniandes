import OrdenamientoHorarios from '@/models/algoritmosOrdenamiento/OrdenamientoHorarios';
import Horario from '@/models/Horario';

export default class OrdenamientoCuposLibres implements OrdenamientoHorarios{
  ordernar(horarios: Horario[]) : void {
    horarios.sort((a, b) => {
        return this.disponibilidadTotal(b) - this.disponibilidadTotal(a);
    });
  }
  /* 
    Calcula la disponibilidad total de cupos en un horario dado. La disponibilidad total se obtiene 
    multiplicando las disponibilidades relativas de cada sección dentro del horario.

    @param horario - Un objeto `Horario` del cual se calcula la disponibilidad total de cupos.
    @returns El valor calculado de disponibilidad total del horario.
  */
  private disponibilidadTotal(horario: Horario): number {
    return horario.secciones.reduce((total, seccion) => {
      return total * (seccion.cuposMaximos == 0 ? 0 : 1 - (Math.min(seccion.cuposTomados, seccion.cuposMaximos) / seccion.cuposMaximos));;
    }, 1)
  }
}