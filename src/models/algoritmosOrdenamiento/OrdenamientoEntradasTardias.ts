import OrdenamientoHorarios from '@/models/algoritmosOrdenamiento/OrdenamientoHorarios';
import Horario from '@/models/Horario';
import BloqueTiempo from '../BloqueTiempo';

export default class OrdenamientoEntradasTardias implements OrdenamientoHorarios{
  ordernar(horarios: Horario[]): void {
    horarios.sort((a, b) => {
      return this.sumaHorasEntrada(b) - this.sumaHorasEntrada(a);
    });
  }
  
  /*  
    Calcula la suma de las horas de entrada de un horario dado.
      
    @param horario - El horario para el cual se calculará el total de horas de entrada.
    @returns La suma de los tiempos de entrada en minutos.
  */
  private sumaHorasEntrada(horario: Horario): number {
    return horario.secciones.reduce((total, seccion) => {
      return total + this.minHoraInicio(seccion.horarios);
    }, 0);
  }
  
  /*
    Calcula la hora de entrada más temprana de una sección dada.
    
    @param bloques - Los bloques de tiempo de un día específico.
    @returns La hora de entrada más temprana en minutos. 
    Si no hay bloques, devuelve 24*60 (1440), que representa el final del día.
   */
  private minHoraInicio(bloques: BloqueTiempo[]): number {
    return bloques.reduce((min, bloque) => Math.min(min, bloque.horaInicio), 24*60);
  }
}