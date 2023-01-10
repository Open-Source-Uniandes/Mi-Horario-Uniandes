/* 
Este módulo transforma el modelo de datos al formato solicitado por la interfaz
*/

import { DataModel } from "../model/DataModel.mjs";
import { Schedule } from "../model/Schedule.mjs";
import { View } from "../view/View.mjs";

class ViewModel {

    constructor() {
        this.dataModel = new DataModel();
        this.view = new View();
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
        // De todos los cursos
        return this.dataModel.data
            // Filtrar los que correspondan al course code
            .filter(course => (course.courseCode === courseCode))
            // Y que estén dentro de las secciones consideradas
            .filter(course => sections.includes(course.section));
    }

    getSchedules({
        courses,    // Array de cursos a combinar
        blocks,     // Array de bloques de tiempo del usuario
        metric,     // métrica a optimizar al generar los horarios
    }) {

        // Transformar los bloques en un Schedule
        blocks = Schedule.fromBlocks(blocks);

        // Obtener las opciones por cada curso
        let courseOptions = courses.map(course => getCourseSections(course));

        // Filtrar aquellas secciones que se cruzan con algún bloque predefinido
        courseOptions = courseOptions.map(
            optionsList => optionsList.filter(
                option => Schedule.merge(option.schedule, blocks).isValid()
            )
        );
        
        // Generar todas las posibles combinaciones válidas
        console.info({numCombinations: courseOptions.reduce((prev,cur) => prev*cur, 1)});  // LOG
        courseOptions = getValidSchedules(courseOptions);

        // Organizar según la métrica a optimizar
        // TODO
        // if(metric === "Min-Huecos")
        // metricFunction = 

        return courseOptions;
    }

    // Recibe un array que contiene arrays con las opciones para cada curso
    getValidSchedules(courseOptions) {

        // Función que genera un producto cartesiano entre todos los conjuntos que se le pasan
        const cartesianProduct = (...sets) => sets.reduce((resultSet, currentSet) => resultSet.flatMap(resultTuple => currentSet.map(currentElement => [resultTuple, currentElement].flat())));
        const allOptions = cartesianProduct(...courseOptions);

        // Generar los Schedules de cada opción y filtrar aquellos que son válidos
        return allOptions
            .map(option => Schedule.merge(...option))
            .filter(schedule => schedule.isValid());
    }
}

export { ViewModel };