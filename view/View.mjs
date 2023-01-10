/* 
Este módulo maneja la interacción con la interfaz
*/

import { CalendarView } from "./CalendarView.mjs";
class View {

    constructor(viewModel) {
        // Guarda una referencia del view model para invocar sus métodos
        this.viewModel = viewModel;
        // Manejo de secciones específicas
        this.calendarView = new CalendarView({
            days : ["l", "m", "i", "j", "v", "s"],
            startTime : "0600",
            endTime : "2100",
        });

        // Configuración del usuario
        this.config = {
            courses : [],
            blocks : [],
            metric : "",
        }
        // Calendarios generados
        this.calendars = undefined;
        this.idxCalendar = 0; // índice del actual

        document.querySelectorAll('.date-last-fetch').forEach(el => el.innerText = new Date().toLocaleString());

        // Agregar event listeners
        // Welcome
        document.querySelector("#btn-start").addEventListener('click', this.openConfig.bind(this));
        // Config
        document.querySelector("#config-courseCode").addEventListener('input', this.showSearchedCourse.bind(this));
        document.querySelector("#btn-open-calendar").addEventListener('click', this.openCalendar.bind(this));
        // Calendar
        document.querySelector("#btn-open-config").addEventListener('click', this.openConfig.bind(this));
        document.querySelector("#prev-calendar").addEventListener('click', () => this.showSchedule(--this.idxCalendar));
        document.querySelector("#next-calendar").addEventListener('click', () => this.showSchedule(++this.idxCalendar));
        window.addEventListener('resize', () => this.showSchedule(this.idxCalendar));
        // Movimiento con las teclas de dirección
        window.addEventListener('keydown', event => {
            switch(event.key) {
            
                case 'ArrowLeft':
                    this.showSchedule(--this.idxCalendar)
                    break;
            
                case 'ArrowRight':
                    this.showSchedule(++this.idxCalendar)
                    break;
            }
        })
    }

    // Establece la interfaz como lista para ejecutarse
    ready() {
        // Eliminar animación de carga
        document.querySelector("#load-start").classList.add("inactive");
        // Mostrar botón de continuar
        document.querySelector("#btn-start").classList.remove("inactive");
    }

    // Abre el modal de configuración
    openConfig() {
        // Cerrar otros modales y abrir configuración
        document.querySelector("#welcome").classList.add("inactive");
        document.querySelector("#calendar").classList.add("inactive");
        document.querySelector("#config").classList.remove("inactive");
    }

    // Abre el modal del calendario
    openCalendar() {
        // Obtener los calendarios válidos
        this.calendars = this.viewModel.getSchedules(this.config);

        // En caso que no existan horarios con la configuración actual
        if(!this.calendars.length) {
            document.querySelector("#no-calendars").classList.remove("inactive");
            return; // Parar la ejecución de la función
        }
        document.querySelector("#no-calendars").classList.add("inactive")

        // Cerrar otros modales y abrir calendario
        document.querySelector("#welcome").classList.add("inactive");
        document.querySelector("#config").classList.add("inactive");
        document.querySelector("#calendar").classList.remove("inactive");

        // Actualizar interfaz
        document.querySelector("#calendar-total").innerText = this.calendars.length;

        // Mostrar el primer calendario 
// TODO BLOQUE
        this.idxCalendar = 0;
        this.showSchedule(this.idxCalendar);
    }

    showSchedule(idx) {
        // Ajustar índice si se sale de los rangos
        this.idxCalendar = Math.max(Math.min(this.calendars.length - 1, idx), 0);
        idx = this.idxCalendar;
        // Limpiar si es necesario
        this.calendarView.clearCalendar();
        // Mostrar los schedules de todos los cursos de la opción seleccionada
        let calendarCourses = this.calendars[idx];
        calendarCourses.forEach(courseSection => this.calendarView.showCourseSchedule(courseSection));
        // Actualizar interfaz
        document.querySelector("#calendar-current").innerText = idx + 1;
    }

    // Muestra la información del curso buscado en el panel de configuración
    showSearchedCourse(event) {

        // Normalizar input
        const courseCode = event.target.value.replace(" ", "").toUpperCase();

        const courseSections = this.viewModel.getCourseSections({courseCode});
        if(courseSections.length) {

            // Actualizar info del curso recuperado
            const courseSectionSample = courseSections[0];
            document.querySelector("#course-title").innerText = courseSectionSample.title;
            document.querySelector("#course-credits").innerText = courseSectionSample.credits;
            document.querySelector("#course-courseCode").innerText = courseSectionSample.courseCode;
            document.querySelector("#course-term").innerText = courseSectionSample.term;

            // Borrar secciones si existe algún elemento
            document.querySelector("#course-options").innerHTML = ""; // Elimina todos los hijos

            // Añadir info de cada sección
            courseSections.forEach(courseSection => {

                // Se crea un nodo nuevo por cada sección
                let node = document.createElement("div");
                // Clases
                node.classList.add("course-option");
                if(courseSection.seatsavail <= 0) node.classList.add("unavailable-option");
                if(this.config.courses.find(course => course.courseCode === courseSection.courseCode)?.sections.includes(courseSection.section)) node.classList.add("selected-option");
                // Event listeners
                node.addEventListener('click', (() => {
                    node.classList.toggle('selected-option');
                    this.toggleCourseSection(courseSection.courseCode, courseSection.section);
                }));

                let h4 = document.createElement("h4");
                h4.innerText = `Sección ${courseSection.section} - NRC ${courseSection.nrc}`
                node.appendChild(h4);

                let instructors = document.createElement("div");
                let h5Instructors = document.createElement("h5");
                h5Instructors.innerText = "Profesores";
                instructors.appendChild(h5Instructors)
                courseSection.instructors.forEach(name => {
                    let p = document.createElement("p");
                    p.innerText = name;
                    instructors.appendChild(p);
                })

                let schedule= document.createElement("div");
                let h5Schedule = document.createElement("h5");
                h5Schedule.innerText = "Horarios";
                schedule.appendChild(h5Schedule)
                const days = ["l", "m", "i", "j", "v", "s"];
                days.forEach(day => {
                    let dayTimeBlocks = courseSection.schedule.timeBlocks[day];
                    if(!dayTimeBlocks.length) return; // Ignorar días sin registros
                    let p = document.createElement("p");
                    let text = dayTimeBlocks
                        .map(timeBlock => timeBlock.toString())
                        .join(", ");
                    p.innerText = `${day.toUpperCase()}: ${text}`;
                    schedule.appendChild(p);
                });

                let container = document.createElement("div");
                container.appendChild(instructors);
                container.appendChild(schedule);
                node.appendChild(container);

                let h5 = document.createElement("h5");
                h5.innerText = `${courseSection.seatsavail} cupos disponibles`
                node.appendChild(h5);

                // Se añade a la lista de secciones
                document.querySelector("#course-options").appendChild(node);
            });

            // Mostrar detalles del curso y ocultar texto que indica que no se encontró
            document.querySelector('#course-details').classList.remove("inactive");
            document.querySelector('#course-not-found').classList.add("inactive");
        }
        else {
            // Ocultar detalles del curso y mostrar un texto que indica que no se encontró
            document.querySelector('#course-not-found').classList.remove("inactive");
            document.querySelector('#course-not-found > span').innerText = courseCode;
            document.querySelector('#course-details').classList.add("inactive");
        }
    }

    // (des)Selecciona una sección de un curso
    toggleCourseSection(courseCode, courseSection) {
        // Hallar configuración previa, si existe
        let courseConfig = this.config.courses.find(course => course.courseCode === courseCode);
        // Añadir config del curso si no existe
        if(!courseConfig) {
            courseConfig = {courseCode, sections: []};
            this.config.courses.push(courseConfig);
        }
        // Si no existe la sección, se agrega
        const idx = courseConfig.sections.indexOf(courseSection);
        if(idx === -1) {
            courseConfig.sections.push(courseSection);
        }
        // Si existe la sección dentro del config, se elimina y, si no queda nada, se borra el curso
        else {
            courseConfig.sections.splice(idx, 1);
            if(!courseConfig.sections.length) this.config.courses = this.config.courses.filter(course => course.courseCode !== courseConfig.courseCode);
        }
    }
}

export { View };