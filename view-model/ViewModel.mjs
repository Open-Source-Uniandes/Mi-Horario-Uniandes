/**
 * Transforma el modelo de datos al formato solicitado por la interfaz
 */

import { DataModel } from "../model/DataModel.mjs";
import { Schedule } from "../model/Schedule.mjs";
import { View } from "../view/View.mjs";


class ViewModel {

    constructor() {
        this.dataModel = new DataModel();
        this.view = new View(this);
    }

    
    /**
     * Punto de entrada para inicializar la aplicación
     */
    start() {
        this.view.ready();
    }

    /**
     * Agrega al modelo los cursos que coincidan con la búsqueda
     * @param {string} search Búsqueda a realizar
     * @returns {Promise} Promesa que se resuelve cuando se agregan los datos
     * 
     * 
    */
    async getSearchData(search) {
        await this.dataModel.getSearchData(search);
    }
    /**
     * Obtiene los cursos que coincidan con el código de curso o el array de secciones a considerar
     * @param {string} courseCode Código del curso, ejemplo "ISIS1105"
     * @param {array} sections Array de secciones a considerar, ejemplo ["1", "2"]
     * @returns {array} Array de objetos con los cursos que coinciden con el código de curso o el array de secciones a considerar
     */
    getCourseSections({
        courseCode,
        sections,
    }) {
        // De todos los cursos, filtrar los que correspondan al course code
        // Si el usuario solicita un nrc (ej 10145)
        let courses = [];
        const nrcRegExp = new RegExp(/^\d+$/); // Un NRC contiene solo números
        const courseRegExp = new RegExp(/^\d+[A-z]?$/); // Un curso contiene solo números y puede (o no) terminar con una letra
        if(nrcRegExp.test(courseCode)) {
            courses =  this.dataModel.data
                .filter(course => (course.nrc == courseCode));
        }
        // Si el usuario solicita un código de curso (ej ADMI1001)
        else if (courseRegExp.test(courseCode.slice(4))) {
            courses =  this.dataModel.data
                .filter(course => (course.courseCode === courseCode));
        }
        // Si el usuario solicita un curso (ej DISEÑO Y ANALISIS DE ALGORITMOS)
        else if (courseCode.length > 3) {
           // Buscar los cursos que contienen la palabra
            courses = this.dataModel.data.filter(course => course.title.includes(courseCode));
        }

        // Y si se solicita, filtrar las secciones pedidas
        if (sections)
            courses = courses.filter(course => sections.includes(course.section));

        return courses;
    }

    async loadCBUS() {
        await this.dataModel.loadCBUS()
    }

    getCbusCourses(blocks, calendario) {
        let cbca = this.dataModel.cbu.cbca;
        let cbco = this.dataModel.cbu.cbco;
        let cbpc = this.dataModel.cbu.cbpc;
        let cbcc = this.dataModel.cbu.cbcc;
        


        // se recorre el calendario y se filtran los cbus que se cruzan con los cursos del calendario
        calendario.forEach(element => {
            cbca = cbca.filter(course => Schedule.merge([element.schedule, course.schedule]).isValid());
            cbco = cbco.filter(course => Schedule.merge([element.schedule, course.schedule]).isValid());
            cbpc = cbpc.filter(course => Schedule.merge([element.schedule, course.schedule]).isValid());
            cbcc = cbcc.filter(course => Schedule.merge([element.schedule, course.schedule]).isValid());
        });
        
        // se revisan tambien los blocks del usuario
        let bloques = Schedule.fromBlocks(blocks);
        cbca = cbca.filter(course => Schedule.merge([bloques, course.schedule]).isValid());
        cbco = cbco.filter(course => Schedule.merge([bloques, course.schedule]).isValid());
        cbpc = cbpc.filter(course => Schedule.merge([bloques, course.schedule]).isValid());
        cbcc = cbcc.filter(course => Schedule.merge([bloques, course.schedule]).isValid());
        

        return {"cbca":cbca,"cbco":cbco,"cbpc":cbpc,"cbcc":cbcc};
    }

    /**
     * Obtiene los bloques de tiempo que coincidan con el código de bloque o el array de bloques a considerar
     * @param {array} courses array de cursos a combinar
     * @param {array} blocks array de bloques de tiempo del usuario
     * @param {*} metric métrica a optimizar al generar los horarios
     * @returns {array} array de todas las combinaciones posibles de horarios válidos
     */
    getSchedules({
        courses,
        blocks,
        metric,
    }) {

        // Transformar los bloques en un Schedule
        // TODO: revisar creación de bloques para todo el semestre
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

    
    /**
     * Obtiene los bloques de tiempo que coincidan con el código de bloque o el array de bloques a considerar
     * @param {array} courseOptions array de cursos a combinar
     */
    #getValidSchedules(courseOptions) {

        // Caso en que no llega ninguna opción
        if(!courseOptions.length) return [];

        // Función que genera un producto cartesiano entre todos los conjuntos que se le pasan
        const cartesianProduct = (sets) => sets.reduce((resultSet, currentSet) => resultSet.flatMap(resultTuple => currentSet.map(currentElement => [resultTuple, currentElement].flat())));
        let allOptions = cartesianProduct(courseOptions);

        // Cuando es un solo curso, el código anterior devuelve [opcion1, opcion2, ...] cuando debería ser [[opcion1], [opcion2], ...]
        if(courseOptions.length === 1) allOptions = allOptions.map(element => [element]);

        // Generar los Schedules de cada opción y filtrar aquellos que son válidos
        return allOptions
            .filter(option => {
                const schedules = option.map(courseSection => courseSection.schedule);
                return Schedule.merge(schedules).isValid();
            });
    }

    /**
     * Calcula el score de una opción para optimizar
     * @param {Schedule} courseOption horario a considerar
     * @param {*} metric métrica seleccionada
     * @returns {number} puntaje de la opción según la métrica
     */
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
