/*
Clase que representa una sección de una materia/curso
*/
class CourseSection {

    constructor({
        title,       // Nombre del curso
        courseCode,  // class + course, por ejemplo "ADMI2501"
        credits,     // Número de créditos
        seatsavail,  // Cupos disponibles
        schedules,   // Horarios
        instructors, // Profesores
        nrc,         // Número único de registro 
        campus,      // Campus
        term,        // Período académico
    }) {

        // Información fundamental
        this.title = title;
        this.courseCode = courseCode;
        this.credits = credits;
        this.seatsavail = seatsavail;
        this.schedules = schedules;

        // Información adicional
        this.information = {
            instructors,
            nrc,
            campus,
            term
        }
    }

    // Retorna una copia para no modificar el objeto original
    get information() {
        return {...this.information}
    }
}

export { CourseSection };