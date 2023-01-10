/* 
Este módulo transforma el modelo de datos al formato solicitado por la interfaz
*/

import { DataModel } from "../model/DataModel.mjs";
import { Schedule } from "../model/Schedule.mjs";
import { View } from "../view/View.mjs";

class ViewModel {

    constructor() {
        this.dataModel = new DataModel();
        this.view = new View(this);
    }

    // Punto de entrada para inicializar la aplicación
    start() {
        //Inicia la descarga de datos
        this.dataModel.loadData()
            // Prepara la interfaz
            .then(this.view.ready.bind(this.view));
    }

    getCourseSections({
        courseCode,     // Código del curso, ejemplo "ISIS1105"
        sections,       // Array de secciones a considerar
    }) {
        // De todos los cursos, filtrar los que correspondan al course code
        let courses =  this.dataModel.data
            .filter(course => (course.courseCode === courseCode));
        // Y si se solicita, filtrar las secciones pedidas
        if(sections)
            courses = courses.filter(course => sections.includes(course.section));
        return courses;
    }

    getSchedules({
        courses,    // Array de cursos a combinar
        blocks,     // Array de bloques de tiempo del usuario
        metric,     // métrica a optimizar al generar los horarios
    }) {

        // Transformar los bloques en un Schedule
        blocks = Schedule.fromBlocks(blocks);

        // Obtener las opciones por cada curso
        let courseOptions = courses.map(course => this.getCourseSections(course));

        // Filtrar aquellas secciones que se cruzan con algún bloque predefinido
        courseOptions = courseOptions.map(
            optionsList => optionsList.filter(
                option => Schedule.merge([option.schedule, blocks]).isValid()
            )
        );
        
        // Generar todas las posibles combinaciones válidas
        console.info({numCombinations: courseOptions.reduce((prev,cur) => prev*cur.length, 1)});  // LOG
        courseOptions = this.#getValidSchedules(courseOptions);

        // Organizar según la métrica a optimizar
        // TODO
        // if(metric === "Min-Huecos")
        // metricFunction = 

        return courseOptions;
    }

    // Recibe un array que contiene arrays con las opciones para cada curso
    #getValidSchedules(courseOptions) {

        // Caso en que no llega ninguna opción
        if(!courseOptions.length) return [];

        // Función que genera un producto cartesiano entre todos los conjuntos que se le pasan
        const cartesianProduct = (sets) => sets.reduce((resultSet, currentSet) => resultSet.flatMap(resultTuple => currentSet.map(currentElement => [resultTuple, currentElement].flat())));
        let allOptions = cartesianProduct(courseOptions);

        /// Cuando es un solo curso, el código anterior devuelve [opcion1, opcion2, ...] cuando debería ser [[opcion1], [opcion2], ...]
        if(courseOptions.length === 1) allOptions = allOptions.map(element => [element]);

        // Generar los Schedules de cada opción y filtrar aquellos que son válidos
        return allOptions
            .filter(option => {
                const schedules = option.map(courseSection => courseSection.schedule);
                return Schedule.merge(schedules).isValid();
            });
    }
}

export { ViewModel };