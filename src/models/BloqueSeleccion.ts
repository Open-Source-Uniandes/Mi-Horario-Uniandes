import Seccion from './Seccion';
import BloqueTiempo from './BloqueTiempo';

export default class BloqueSeleccion {
    secciones: Seccion[] = [];
    bloquesLibres: BloqueTiempo[] = [];

    constructor(secciones: Seccion[] = [], bloquesLibres: BloqueTiempo[] = []) {
        this.secciones = secciones;
        this.bloquesLibres = bloquesLibres;
    }
}
