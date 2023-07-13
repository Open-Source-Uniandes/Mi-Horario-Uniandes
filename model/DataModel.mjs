/* 
Este módulo se encarga de leer y procesar la información de la API
*/

import { CourseSection } from "./CourseSection.mjs";
import { Trie } from "./Trie.mjs";

class DataModel {

    // Endpoint de cursos registrados en Banner
    static API = 'https://ofertadecursos.uniandes.edu.co/api/courses';

    // Carga los datos desde la API
    async loadData() {

        // Obtener datos (aprox 20 segundos)
        this.lastTime = new Date().toLocaleString();
        this.trie = new Trie();
        this.data = await fetch(DataModel.API)
            .then(response => response.json())
            // Añadir el atributo courseCode = class + course
            .then(response => response.map(response => ({ ...response, courseCode: response.class + response.course })))
            .then(response => response.map(response => {
            // Eliminar espacios adicionales en el título
            response.title = response.title.replace(/\s+/g, ' ').trim();
            // Eliminar todas las tildes
            response.title = response.title.replace('Á', 'A').replace('É', 'E').replace('Í', 'I').replace('Ó', 'O').replace('Ú', 'U');
            return new CourseSection(response);
            }));
            for (let course of this.data) {
                this.trie.insert(course.title);
            }
    }
}

export { DataModel };