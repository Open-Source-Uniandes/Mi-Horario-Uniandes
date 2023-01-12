/* 
Este módulo transforma el modelo de datos al formato solicitado por la interfaz
*/

import { DataModel } from "../model/DataModel.mjs";
import { Schedule } from "../model/Schedule.mjs";
import { TimeBlock } from "../model/TimeBlock.mjs";
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
        // Si el usuario solicita un nrc (ej 10145)
        let courses = [];
        const nrcRegExp = new RegExp(/^\d+$/); // Un nrc contiene solo números
        if(nrcRegExp.test(courseCode)) {  
            courses =  this.dataModel.data
                .filter(course => (course.nrc == courseCode));
        }
        // Si el usuario solicita un código de curso (ej ADMI1001)
        else {
            courses =  this.dataModel.data
                .filter(course => (course.courseCode === courseCode));
        }
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

        // Organizar descendentemente según la métrica a optimizar
        courseOptions.sort((a, b) => (this.#customScore(b, metric) - this.#customScore(a, metric)));

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

    // Calcular el score de una opción para optimizar 
    // option es un schedule
    #customScore(courseOption, metric) {

        // Sacar los bloques de tiempo del schedule
        let option = Schedule.merge(courseOption.map(courseSection => courseSection.schedule));
        let timeBlocks = option.timeBlocks;

        // Funciones de utilidad
        // Calcula el instante de tiempo con valor más alto cada día
        const maxInstantInArray = (timeBlocks) => {
            return timeBlocks.reduce((a,b) => Math.max(a, b.endTime), 0);
        }

        // Calcula el instante de tiempo con valor más bajo cada día
        const minInstantInArray = (timeBlocks) => {
            return timeBlocks.reduce((a,b) => Math.min(a, b.startTime), 24*60); // último momento del día como default
        }

        if(metric === "MinHuecos") {
            // índice para iterar
            let indexes = [...Array(Object.keys(timeBlocks).length).keys()];
            let arrays = Object.values(timeBlocks);
            // Obtener span de tiempo
            let startTimeByDay = arrays.map(minInstantInArray);
            let endTimeByDay = arrays.map(maxInstantInArray);
            let timeSpanByDay = indexes.map(idx => Math.max(endTimeByDay[idx] - startTimeByDay[idx], 0));
            // Tiempo usado (no hueco)
            let usedTimeByDay = arrays.map(dayBlocks => 
                dayBlocks.reduce((prev,act) => prev + act.duration, 0)
            );
            // Todo el tiempo entre los límites del usuario menos lo realmente usado (que no es hueco)
            let unusedTimeByDay = indexes.map(idx => timeSpanByDay[idx] - usedTimeByDay[idx]);

            return -unusedTimeByDay.reduce((a,b) => a+b, 0); // Devuelve la suma; 
        }
        else if(metric === "MinSalida") {
            let endTimeByDay = Object.values(timeBlocks).map(maxInstantInArray);
            return -endTimeByDay.reduce((a,b) => a+b, 0); // Devuelve la suma
        }
        else if(metric === "MaxEntrada") {
            let startTimeByDay = Object.values(timeBlocks).map(minInstantInArray);
            return startTimeByDay.reduce((a,b) => a+b, 0); // Devuelve la suma
        }
        else {  // Aleatorio
            return Math.random();
        }
    }
}

export { ViewModel };