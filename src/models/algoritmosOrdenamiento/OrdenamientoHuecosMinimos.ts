import OrdenamientoHorarios from '@/models/algoritmosOrdenamiento/OrdenamientoHorarios';
import Horario from '@/models/Horario';
import BloqueTiempo from '../BloqueTiempo';

export default class OrdenamientoHuecosMinimos implements OrdenamientoHorarios {
  ordernar(horarios: Horario[]): void {
    horarios.sort((a, b) => {
      return this.calcularHuecos(a) - this.calcularHuecos(b);
    });
  }

  /*
  Calcula la cantidad de huecos en un horario dado.
  
  @param horario - El horario para el cual se calcularán los huecos.
  @returns El total de huecos en minutos.
  */
  private calcularHuecos(horario: Horario): number {
    const bloques = horario.secciones.flatMap(seccion => seccion.horarios);
    const primerBloque = this.minHoraInicio(bloques);
    const ultimoBloque = this.maxHoraFin(bloques);
    /*
    Calcula el span total (diferencia entre la primera entrada y la última salida).
    */
    let spanTotal = ultimoBloque - primerBloque;
    /*
    Resta las horas ocupadas en clase.
    */
    bloques.forEach(bloque => {
      const duracionClase = bloque.horaFin - bloque.horaInicio;
      spanTotal -= duracionClase;
    });

    return spanTotal;
  }
  
  /*
    Obtiene la hora de inicio más temprana de un conjunto de bloques de tiempo.
    
    @param bloques - Los bloques de tiempo a evaluar.
    @returns La hora de inicio más temprana en minutos.
  */
  private minHoraInicio(bloques: BloqueTiempo[]): number {
    return bloques.reduce((min, bloque) => Math.min(min, bloque.horaInicio), 24 * 60);
  }

  /*
    Obtiene la hora de fin más tardía de un conjunto de bloques de tiempo.
    
    @param bloques - Los bloques de tiempo a evaluar.
    @returns La hora de fin más tardía en minutos.
  */
  private maxHoraFin(bloques: BloqueTiempo[]): number {
    return bloques.reduce((max, bloque) => Math.max(max, bloque.horaFin), 0);
  }
}