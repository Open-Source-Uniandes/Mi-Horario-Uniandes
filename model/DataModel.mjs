// Importa la clase CourseSection
import { CourseSection } from "./CourseSection.mjs";

// Define la clase DataModel
class DataModel {

    // Define la URL de la API como una constante estática
    static API = 'https://ofertadecursos.uniandes.edu.co/api/courses';
    static SEARCH_PARAMS = (courseCode) => this.API + '?term=&ptrm=&prefix=&attr=&nameInput=' + courseCode;

    data = [];
    addedCourses = {};
    // Método para cargar los datos
    async loadData() {
        // Almacena la fecha y hora actual
        this.lastTime = new Date().toLocaleString();
        // Inicializa los cbus
        this.cbu = { "cbca": [], "cbco": [], "cbpc": [], "cbcc": [] };
        // Hace una petición a la API, procesa la respuesta y almacena los datos
        this.data = await fetch(DataModel.API)
            .then(response => response.json())
            .then(response => response.map(this.processResponseData));

        // Recorre todos los cursos y los clasifica en los cbus
        this.data.forEach(course => {
            if (course.courseCode.startsWith('CBCA')) {
                this.cbu.cbca.push(course);
            }
            else if (course.courseCode.startsWith('CBCO')) {
                this.cbu.cbco.push(course);
            }
            else if (course.courseCode.startsWith('CBPC')) {
                this.cbu.cbpc.push(course);
            }
            else if (course.courseCode.startsWith('CBCC')) {
                this.cbu.cbcc.push(course);
            }
        }
        );
    }

    // Método para obtener los datos a partir de una busqueda
    async getSearchData(search) {
        const new_data = (await fetch(DataModel.SEARCH_PARAMS(search))
            .then(response => response.json())
            .then(response => response.map(this.processResponseData.bind(this))))


        this.data = this.data.concat(new_data.filter(course => !(course.courseCode in this.addedCourses)));

        new_data.forEach(course => this.addedCourses[course.courseCode] = true);
    }

    async loadCBUS() {
        const loadCbus = new Promise((resolve, reject) => {
        resolve(this.getSearchData('CBCA'))
        resolve(this.getSearchData('CBPC'))
        resolve(this.getSearchData('CBCO'))
        resolve(this.getSearchData('CBPC'))
        })

        await loadCbus.then(this.clasifyCbus.bind(this));
    }

    clasifyCbus() {
        this.cbu = { "cbca": [], "cbco": [], "cbpc": [], "cbcc": [] };
        this.data.forEach(course => {
            if (course.courseCode.startsWith('CBCA')) {
                this.cbu.cbca.push(course);
            }
            else if (course.courseCode.startsWith('CBCO')) {
                this.cbu.cbco.push(course);
            }
            else if (course.courseCode.startsWith('CBPC')) {
                this.cbu.cbpc.push(course);
            }
            else if (course.courseCode.startsWith('CBCC')) {
                this.cbu.cbcc.push(course);
            }
        }
        );
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
            .replace(/[ÁÉÍÓÚ]/g, function (c) {
                return c === 'Á' ? 'A' :
                    c === 'É' ? 'E' :
                        c === 'Í' ? 'I' :
                            c === 'Ó' ? 'O' :
                                c === 'Ú' ? 'U' : c;
            })
            // Convierte el título a mayúsculas
            .toUpperCase();

        // Agrega el curso a los cursos agregados
        // Devuelve un nuevo objeto CourseSection basado en el objeto de datos procesado
        return new CourseSection(responseData);
    }

    sendMail(message) {
        console.log(message);
    }
}

// Exporta la clase DataModel
export { DataModel };
