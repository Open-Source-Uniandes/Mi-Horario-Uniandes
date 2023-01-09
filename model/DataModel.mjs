/* 
Este módulo se encarga de leer y procesar la información de la API
*/

import { CourseSection } from "./CourseSection.mjs";

class DataModel {

    // Endpoint de cursos registrados en Banner
    static API = 'https://ofertadecursos.uniandes.edu.co/api/courses';

    // Carga los datos desde la API
    async loadData() {

        // Obtener datos (aprox 20 segundos)
        this.lastTime = new Date().toLocaleString();
        this.data = await fetch(DataModel.API)
            .then(response => response.json())
            // Añadir el atributo courseCode = class + course
            .then(response => response.map(response => ({...response, courseCode : response.class + response.course})))
            .then(response => response.map(response => new CourseSection(response)));
    }
}

export { DataModel };