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

        // Agregar event listeners
        // Welcome
        document.querySelector("#btn-start").addEventListener('click', this.openConfig.bind(this));
        // Config
        document.querySelector("#config-courseCode").addEventListener('input', this.showSearchedCourse.bind(this));
        // Calendar
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
        // Cerrar otros modales y abrir calendario
        document.querySelector("#welcome").classList.add("inactive");
        document.querySelector("#config").classList.add("inactive");
        document.querySelector("#calendar").classList.remove("inactive");
    }

    // Muestra la información del curso buscado en el panel de configuración
    showSearchedCourse(event) {

        // Normalizar input
        const courseCode = event.target.value.replace(" ", "").toUpperCase();
        const sections = ["1", "2", "3", "4", "5"];//TODO

        const courseSections = this.viewModel.getCourseSections({courseCode, sections});
        if(courseSections.length) {

            // Actualizar info del curso recuperado
            const courseSectionSample = courseSections[0];
            document.querySelector("#course-title").innerText = courseSectionSample.title;
            document.querySelector("#course-credits").innerText = courseSectionSample.credits;
            document.querySelector("#course-courseCode").innerText = courseSectionSample.courseCode;
            document.querySelector("#course-term").innerText = courseSectionSample.term;

            // Añadir info de cada sección
            courseSections.forEach(courseSection => {

                // Se crea un nodo nuevo por cada sección
                let node = document.createElement("div");
                node.classList.add("course-option");
                if(courseSection.seatsavail <= 0) node.classList.add("unavailable-option");

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
}

export { View };