// Importa la clase CourseSection
import { CourseSection } from "./CourseSection.mjs";

// Define la clase DataModel
class DataModel {

    // Define la URL de la API como una constante estática
    static API = 'https://ofertadecursos.uniandes.edu.co/api/courses';

    // Método para cargar los datos
    async loadData() {
        // Almacena la fecha y hora actual
        this.lastTime = new Date().toLocaleString();
        
        // Hace una petición a la API, procesa la respuesta y almacena los datos
        this.data = await fetch(DataModel.API)
            .then(response => response.json())
            .then(response => response.map(this.processResponseData));
    }

    // Método para procesar cada objeto de datos de la respuesta
    processResponseData(responseData) {
        // Crea un nuevo atributo, courseCode, que es la concatenación de class y course
        responseData.courseCode = responseData.class + responseData.course;
        
        // Limpia y normaliza el atributo title
        responseData.title = responseData.title
            // Reemplaza cualquier secuencia de espacios con un solo espacio
            .replace(/\s+/g, ' ').trim()
            // Reemplaza las vocales con tildes por vocales sin tildes
            .replace(/[ÁÉÍÓÚ]/g, function(c) {
                return c === 'Á' ? 'A' :
                    c === 'É' ? 'E' :
                    c === 'Í' ? 'I' :
                    c === 'Ó' ? 'O' :
                    c === 'Ú' ? 'U' : c;
            })
            // Convierte el título a mayúsculas
            .toUpperCase();
        
        // Devuelve un nuevo objeto CourseSection basado en el objeto de datos procesado
        return new CourseSection(responseData);
    }
}

// Exporta la clase DataModel
export { DataModel };
