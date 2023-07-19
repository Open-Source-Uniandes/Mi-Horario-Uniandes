/**
 * Clase que representa una sección de un curso.
 */

import { Schedule } from "./Schedule.mjs";


class CourseSection {

    /**
     * @param {string} title Nombre del curso
     * @param {string} courseCode class + course, por ejemplo "ADMI2501"
     * @param {number} credits Número de créditos
     * @param {number} maxenrol Cupos máximos
     * @param {number} projenrl Cupos proyectados
     * @param {number} seatsavail Cupos disponibles
     * @param {Array} schedules Horarios
     * @param {Array} instructors Profesores
     * @param {number} section Número de sección
     * @param {number} nrc Número único de registro
     * @param {string} campus Campus
     * @param {string} term Período académico
     * @param {string} ptrmdesc Descripción del período académico (i.e PERIODO 202320 - 16 SEMANAS)
     * @returns {CourseSection}
     */
    constructor({
        title,      
        courseCode,  
        credits,
        maxenrol,
        projenrl,     
        seatsavail,  
        schedules,   
        instructors, 
        section,     
        nrc,         
        campus,      
        term,
        ptrmdesc
    }) {
        this.title = title;
        this.courseCode = courseCode;
        this.credits = credits;
        this.maxenrol = maxenrol;
        this.projenrl = projenrl;
        this.seatsavail = seatsavail;
        this.schedule = new Schedule(schedules, ptrmdesc);
        // lista los instructores
        this.instructors = instructors.map(element => element.name.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "));
        this.section = section;
        this.nrc = nrc;
        this.campus = campus;
        this.term = term;
    }
}


export { CourseSection };