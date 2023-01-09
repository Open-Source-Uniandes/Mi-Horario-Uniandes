/* 
Este módulo se encarga de leer y procesar la información de la API
*/

import { CourseSection } from "./CourseSection.mjs";

class DataModel {

    // Endpoint de cursos registrados en Banner
    static API = 'https://ofertadecursos.uniandes.edu.co/api/courses';

    // Devuelve fecha de la última carga de datos, o undefined si no existe
    static lastDataTime() {
        const lastTime = localStorage.getItem('Uniandes-lastDataTime');
        return lastTime;
    }

    // Devuelve los últimos datos cargados
    // Los datos deben existir en localStorage
    static getData() {
        const dataModel = localStorage.getItem('Uniandes-dataModel');
        return JSON.parse(dataModel);
    }

    // Vuelve a cargar los datos desde la API y los guarda en localStorage
    static async reloadData() {

        // Obtener datos (aprox 20 segundos)
        const lastTime = new Date().toLocaleString();
        const dataModel = await fetch(DataModel.API)
            .then(response => response.json())
            // Añadir el atributo courseCode = class + course
            .then(response => response.map(response => ({...response, courseCode : response.class + response.course})))
            .then(response => response.map(response => new CourseSection(response)))
            .then(response => JSON.stringify(response));

        // Guardarlos en localStorage
        localStorage.setItem('Uniandes-dataModel', dataModel);
        localStorage.setItem('Uniandes-lastDataTime', lastTime);
    }
}

export { DataModel };