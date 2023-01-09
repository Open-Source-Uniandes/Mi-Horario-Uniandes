/* 
Este módulo transforma el modelo de datos al formato solicitado por la interfaz
*/

import { DataModel } from "../model/DataModel.mjs";
import { Schedule } from "model/Schedule.mjs";

class ViewModel {

    // Modelo de datos
    static dataModel = new DataModel();

    static getValidSchedules() {
        // Generar todas las posibles combinaciones
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