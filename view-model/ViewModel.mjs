/* 
Este módulo transforma el modelo de datos al formato solicitado por la interfaz
*/

import { DataModel } from "../model/DataModel.mjs";
import { Schedule } from "../model/Schedule.mjs";

class ViewModel {

    constructor() {
        this.dataModel = new DataModel();
    }

    // Inicia la descarga de datos y devuelve la fecha de actualización de los datos
    async loadData() {
        await this.dataModel.loadData();
        return this.dataModel.lastTime;
    }


    static getValidSchedules() {

        // Generar todas las posibles combinaciones

        // Filtrar aquellas opciones que son válidas

    }

}


/* 
NECESITO:
- Recibir lista de cursos (con opciones)
- Llamar métodos necesarios para:
    Generar todos los posibles horarios
    Devolver aquellos horarios válidos
    (implementar funcionalidades extra)
- Interactuar con la interfaz para actualizar la info
*/



export { ViewModel };