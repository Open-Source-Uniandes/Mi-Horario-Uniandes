import OrdenamientoHorarios from '@/models/algoritmosOrdenamiento/OrdenamientoHorarios';
import Horario from '@/models/Horario';
export default class OrdenamientoAleatorio implements OrdenamientoHorarios{
  ordernar(horarios: Horario[]) : void {
    for (let indice = horarios.length - 1; indice > 0; indice--) {
      const indiceAleatorio = Math.floor(Math.random() * (indice + 1));
      [horarios[indice], horarios[indiceAleatorio]] = [
        horarios[indiceAleatorio],
        horarios[indice],
      ];
    }
  }
}