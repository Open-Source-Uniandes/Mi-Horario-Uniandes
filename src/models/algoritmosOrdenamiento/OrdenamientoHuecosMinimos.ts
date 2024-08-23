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
    Calcula la cantidad total de huecos en un horario dado, considerando cada día por separado.
    @param horario - El horario para el cual se calcularán los huecos.
    @returns El total de huecos en minutos.
  */
  private calcularHuecos(horario: Horario): number {
    const bloquesPorDia: { [dia: string]: BloqueTiempo[] } = this.bloquesPorDia(horario);
    let huecosTotales = 0;

    for (const dia in bloquesPorDia) {
      const bloques = bloquesPorDia[dia];

      bloques.sort((a, b) => a.horaInicio - b.horaInicio);

      huecosTotales += this.huecosDia(bloques);
    }

    return huecosTotales;
  }
  /*
    Organiza los bloques de tiempo de un horario en un objeto donde cada clave es un día.
    @param horario - El horario del cual se obtendrán los bloques.
    @returns Un objeto que mapea los días a sus respectivos bloques de tiempo.
  */
  private bloquesPorDia(horario: Horario): { [dia: string]: BloqueTiempo[] } {
    const bloquesPorDia: { [dia: string]: BloqueTiempo[] } = {};
    horario.secciones.forEach(seccion => {
      seccion.horarios.forEach(bloque => {
        bloque.dias.forEach(dia => {
          if (!bloquesPorDia[dia]) {
            bloquesPorDia[dia] = [];
          }
          bloquesPorDia[dia].push(bloque);
        });
      });
    });

    return bloquesPorDia;
  }
  /*
    Calcula los huecos dentro de un día específico, dado un conjunto de bloques de tiempo.
    @param bloques - Los bloques de tiempo de un día específico.
    @returns El total de huecos en minutos para ese día.
  */
  private huecosDia(bloques: BloqueTiempo[]): number {
    if (bloques.length === 0) return 0;
    
    let huecos = 0;
    let ultimoFin = bloques[0].horaFin;

    for (let i = 1; i < bloques.length; i++) {
      const bloque = bloques[i];

      if (bloque.horaInicio > ultimoFin) {
        huecos += bloque.horaInicio - ultimoFin;
      }
      ultimoFin = Math.max(ultimoFin, bloque.horaFin);
    }

    return huecos;
  }
}