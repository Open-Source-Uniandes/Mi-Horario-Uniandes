/**
 * Maneja la interacción con la interfaz
 */

import { TimeBlock } from "../model/TimeBlock.mjs";
import { CalendarView } from "./CalendarView.mjs";


class View {

    /**
     * Constructor
     * @param {*} viewModel 
     */
    constructor(viewModel) {
        // Guarda una referencia del view model para invocar sus métodos
        this.viewModel = viewModel;
        // Manejo de secciones específicas
        this.calendarView = new CalendarView({
            days : ["l", "m", "i", "j", "v", "s"],
            startTime : "0600",
            endTime : "2100",
        });

        // Cargar configuración previa del usuario
        this.config = this.getConfig();

        // Calendarios generados
        this.calendars = [];
        this.idxCalendar = 0; // índice del actual

        document.querySelectorAll('.date-last-fetch').forEach(el => el.innerText = new Date().toLocaleString());

        // Agregar event listeners
        // Welcome
        document.querySelector("#btn-start").addEventListener('click', this.openConfig.bind(this));
        // Config
        document.querySelector("#config-courseCode").addEventListener('input', this.showSearchedCourse.bind(this));
        document.querySelector("#btn-open-calendar").addEventListener('click', this.openCalendar.bind(this));
        document.querySelector("#btn-add-block").addEventListener('click', this.addBlock.bind(this));
        document.querySelector("#btn-reset-blocks").addEventListener('click', this.resetBlocks.bind(this));
        document.querySelector("#btn-reset-courses").addEventListener('click', this.resetCourses.bind(this));
        document.querySelectorAll("#step2 .checkbox").forEach(element => element.addEventListener('click', () => element.classList.toggle("chkbox-selected")));
        document.querySelectorAll('input[name="optimizar"]').forEach(element => element.addEventListener('click', this.changeMetric.bind(this)));
        
        document.querySelector("#btn-select-all-options").addEventListener('click', () => { // Añadir botón de seleccionar todas las secciones 
            document.querySelectorAll("#course-options > *").forEach(node => {
                // Si no está marcado como seleccionado
                if(!node.classList.contains('selected-option')) {
                    // Se ejecuta su evento click para marcarlo
                    node.click();
                }
        })});
        document.querySelector("#btn-select-none-options").addEventListener('click', () => { // Añadir botón de deseleccionar todas las secciones
            document.querySelectorAll("#course-options > *").forEach(node => {
                // Si está marcado como seleccionado
                if(node.classList.contains('selected-option')) {
                    // Se ejecuta su evento click para desmarcarlo
                    node.click();
                }
        })});


        document.querySelector("#btn-select-valid-options").addEventListener('click', () => { // Añadir botón de seleccionar todas las secciones con cupos
            document.querySelectorAll("#course-options > *").forEach(node => {
                // Si está marcado como seleccionado
                if(node.classList.contains('selected-option')) {
                    // Se ejecuta su evento click para desmarcarlo
                    node.click();
                }
                if(!node.classList.contains('unavailable-option')) {
                    // Se ejecuta su evento click para marcarlo si tiene cupos
                    node.click();
                }

        })});


        // Calendar
        document.querySelector("#btn-open-config").addEventListener('click', this.openConfig.bind(this));
        document.querySelector("#prev-calendar").addEventListener('click', () => this.showSchedule(this.idxCalendar - 1));
        document.querySelector("#next-calendar").addEventListener('click', () => this.showSchedule(this.idxCalendar + 1));

        // Movimiento con el input de calendario
        document.querySelector("#calendar-current").addEventListener('keydown', (event) => {
            if(event.key === 'Enter') {
                if (event.target.value > 0 && event.target.value <= this.calendars.length) this.showSchedule(parseInt(event.target.value) - 1);
                else event.target.value = this.idxCalendar + 1;
            }
        });
        // Movimiento con las teclas de dirección
        window.addEventListener('keydown', event => {
            switch(event.key) {
                case 'ArrowLeft':
                    this.showSchedule(this.idxCalendar - 1)
                    break;
                case 'ArrowRight':
                    this.showSchedule(this.idxCalendar + 1)
                    break;
            }
        })
    }    
    
    /**
     * Establece la interfaz como lista para ejecutarse
     */
    ready() {
        // Eliminar animación de carga
        document.querySelector("#load-start").classList.add("inactive");
        // Mostrar botón de continuar
        document.querySelector("#btn-start").classList.remove("inactive");

        // Carga de configuración previa
        // Mostrar los cursos guardados
        this.config.courses.forEach(this.showAddedCourse.bind(this));
        // Mostrar los bloques guardados
        this.config.blocks.forEach(this.showAddedBlock.bind(this));
        // Mostrar la métrica guardada en la configuración
        document.querySelector(`input[name="optimizar"][value="${this.config.metric}"]`).checked = true;
    }


    /**
     * Abre el modal de configuración
     */
    openConfig() {
        // Cerrar otros modales y abrir configuración
        document.querySelector("#welcome").classList.add("inactive");
        document.querySelector("#calendar").classList.add("inactive");
        document.querySelector("#config").classList.remove("inactive");
    }

    
    /**
     * Abre el modal de calendario
     */
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
        this.idxCalendar = 0;
        this.showSchedule(this.idxCalendar);
    }


    /**
     * Añade un bloque de tiempo a la configuración
     */
    addBlock() {

        // Si no han agregado las horas, parar
        if(document.getElementById("block-time-start").value === '' || document.getElementById("block-time-end").value === '') return;

        // Obtiene los datos
        let startTime = TimeBlock.calculateInstant(document.getElementById("block-time-start").value.replace(":", ""));
        let endTime = TimeBlock.calculateInstant(document.getElementById("block-time-end").value.replace(":", ""));
        if(endTime < startTime) {
            [startTime, endTime] = [endTime, startTime];
        }

        const elements = ["l", "m", "i", "j", "v", "s"];
        let days = elements
            .filter( element => document.getElementById("block-chkbox-" + element).classList.contains("chkbox-selected"))
            .map(element => element.toLowerCase());

        // Si no han agregado los días, parar
        if(!days.length) return;

        const block = {
            days,
            startTime,
            endTime,
        };
        this.config.blocks.push(block);

        // Resetea la configuración al estado inicial
        document.querySelectorAll("#step2 .checkbox").forEach(element => element.classList.remove("chkbox-selected"));
        document.getElementById("block-time-start").value = null;
        document.getElementById("block-time-end").value = null;

        // Actualiza la interfaz de bloques creados
        this.showAddedBlock(block);

        this.setConfig() // Actualiza la config
    }


    /**
     * Añade el bloque a la lista "my-blocks" de la interfaz
     * @param {array} days lista de días del bloque
     * @param {string} startTime tiempo inicial del bloque
     * @param {string} endTime tiempo final del bloque
     */
    showAddedBlock({
        days,
        startTime,
        endTime,
    }) {

        const elements = ["l", "m", "i", "j", "v", "s"];

        let node = document.createElement("div");
        node.classList.add("my-block");
        let container = document.createElement("div");
        container.style.justifyContent = "space-around";
        container.classList.add("container-row");
        node.appendChild(container);
        elements.forEach(element => {
            let el = document.createElement("div");
            el.classList.add("checkbox");
            if(days.includes(element)) el.classList.add("chkbox-selected");
            el.innerText = element.toUpperCase();
            container.appendChild(el);
        })
        let strong = document.createElement("strong");
        strong.innerText = `${TimeBlock.calculateTime(startTime)} - ${TimeBlock.calculateTime(endTime)}`
        node.appendChild(strong)
        document.getElementById("my-blocks").prepend(node);

        // Boton que elimina el bloque desde el que se pulsa
        let btn = document.createElement("button");
        btn.classList.add("btn-remove-block");
        btn.innerText = "Eliminar";
        btn.addEventListener('click', () => {
            node.remove();
            this.config.blocks = this.config.blocks.filter(block => block.days !== days || block.startTime !== startTime || block.endTime !== endTime);
            this.setConfig()
        }
        );
        node.appendChild(btn);
    }
    /**
     * Elimina todos los bloques de la configuración
     */
    resetBlocks() {
        this.config.blocks=[] //Elimina los bloques seleccionados

        // Elimina todos los hijos
        const myBlocks = document.getElementById("my-blocks");
        while (myBlocks.firstChild && myBlocks.firstChild.id !== "btn-reset-blocks") {
          myBlocks.removeChild(myBlocks.firstChild);
        }

        this.setConfig() // Actualiza la config
    }


    /**
     * Muestra el calendario con el índice idx
     * @param {number} idx índice del calendario a mostrar
     */
    showSchedule(idx) {
        // Ignorar el llamado de la función si se sale de los rangos
        if(idx < 0 || idx > this.calendars.length - 1) return;
        // Ajustar el valor interno de idxCalendar
        this.idxCalendar = idx
        // Añadir créditos totales
        let totalCredits = 0;
        for (let course of this.config.courses) {
            totalCredits += parseInt(course.credits);
        }

        // Limpiar si es necesario
        this.calendarView.clearCalendar();
        // Mostrar los bloques de tiempo
        this.calendarView.showBlocks(this.config.blocks);
        // Mostrar los schedules de todos los cursos de la opción seleccionada
        let calendarCourses = this.calendars[idx];
        calendarCourses.forEach(courseSection => this.calendarView.showCourseSchedule(courseSection));
        // Actualizar interfaz
        document.querySelector("#calendar-current").value = idx + 1;
        document.querySelector("#credits-current").innerText = totalCredits;
    }


    /**
     * Muestra la información del curso buscado en el panel de configuración
     * @param {event} event evento de input
     */
    showSearchedCourse(event) {

        // Normalizar input
        const courseCode = event.target.value.toUpperCase().trim();

        const courseSections = this.viewModel.getCourseSections({courseCode});
        if(courseSections.length) {

            // Se eliminan todos los nodos hijos del div de coincidencias de cursos course-coincidences
            document.querySelector("#course-coincidences").innerHTML = ""; // Elimina todos los hijos

            // Se crea un set para obtener los cursos unicos
            let uniqueCourses  = new Set()

            courseSections.forEach(courseSection => {
                uniqueCourses.add(courseSection.title + "%&%" +courseSection.courseCode + "%&%" + courseSection.credits +"%&%" + courseSection.term)
            })

            // Si solo hay un curso, se muestra y ademas se muestran sus secciones
            if (uniqueCourses.size == 1) {
                // Se crea un nodo para el curso, el cual se añade al div de coincidencias de cursos course-coincidences
                let node = document.createElement("div");
                node.classList.add("course-coincident");

                let h2 = document.createElement("h2");
                h2.innerText = `${courseSections[0].title}`
                node.appendChild(h2);

                let h4 = document.createElement("h4");
                h4.innerText = `${courseSections[0].credits} créditos`
                node.appendChild(h4);

                let h3 = document.createElement("h3");
                h3.innerText = `${courseSections[0].courseCode}`
                node.appendChild(h3);


                let h5 = document.createElement("h5");
                h5.innerText = `Periodo: ${courseSections[0].term}`
                node.appendChild(h5);


                document.querySelector("#course-coincidences").appendChild(node);


                
            }
            else { 
                // Si hay varios cursos
                // se itera el set y se crea un nodo para cada elemento
                let p = document.createElement("p");
                p.innerText = "Selecciona el curso que buscas"
                document.querySelector("#course-coincidences").appendChild(p);
                uniqueCourses.forEach(course => {
                    // Se crea un nodo para el curso, el cual se añade al div de coincidencias de cursos course-coincidences
                    // Este nodo al pulsarse, elimina los demas nodos course-coincident y muestra las secciones del curso seleccionado
                    let node = document.createElement("div");
                    node.classList.add("course-coincident");
                    let h2 = document.createElement("h2");
                    h2.innerText = `${course.split("%&%")[0]}`
                    node.appendChild(h2);
                    let h4 = document.createElement("h4");
                    h4.innerText = `${course.split("%&%")[2]} créditos`
                    node.appendChild(h4);
                    let h3 = document.createElement("h3");
                    h3.innerText = `${course.split("%&%")[1]}`
                    node.appendChild(h3);
                    let h5 = document.createElement("h5");
                    h5.innerText = `Periodo: ${course.split("%&%")[3]}`
                    node.appendChild(h5);
                    document.querySelector("#course-coincidences").appendChild(node);

                    //añadir el evento click a cada nodo
                    node.addEventListener('click', (() => {

                        document.querySelector("#course-options").innerHTML = ""; // Elimina todos los hijos
                        //elimina los demas nodos course-coincident cuyo codigo de curso sea diferente al del nodo seleccionado
                        document.querySelectorAll(".course-coincident").forEach(element => {
                            if(element.querySelector("h3").innerText !== course.split("%&%")[1]) {
                                element.remove();
                            }
                        });
                        //llama a la funcion que muestra la info de cada seccion
                        this.showSearchedCourseAux(courseSections.filter(courseSection => courseSection.courseCode === course.split("%&%")[1]));
                    }));
                }
                )
            }

            // Borrar secciones si existe algún elemento
            document.querySelector("#course-options").innerHTML = ""; // Elimina todos los hijos

            // Añadir info de cada sección
            if (uniqueCourses.size == 1) {
                this.showSearchedCourseAux(courseSections);
            }
            

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



    /**
     * Muestra la información de todas las secciones de un curso buscado en el panel de configuración
     * @param {courseSections} array de secciones de un curso
    */

    showSearchedCourseAux(courseSections) {
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
            this.toggleCourseSection(courseSection.courseCode, courseSection.section, courseSection.credits );
        }));
        let h2 = document.createElement("h2");
        h2.innerText = `${courseSection.title}`
        node.appendChild(h2);

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

    }




    /**
     * Añade o elimina una sección de un curso de la preselección
     * @param {string} courseCode código del curso
     * @param {number} courseSection sección del curso
     * @param {number} credits número de créditos
     */
    toggleCourseSection(
        courseCode, 
        courseSection, 
        credits
    ) {
        // Hallar configuración previa, si existe
        let courseConfig = this.config.courses.find(course => course.courseCode === courseCode);
        if(!courseConfig) {

            // Añadir config del curso si no existe
            courseConfig = {courseCode, sections: [], credits};
            this.config.courses.push(courseConfig);

            // Añadir el curso a la lista de cursos de la interfaz
            this.showAddedCourse(courseConfig);

        }
        // Si no existe la sección, se agrega
        const idx = courseConfig.sections.indexOf(courseSection);
        if(idx === -1) {
            courseConfig.sections.push(courseSection);
        }
        // Si existe la sección dentro del config, se elimina
        else {
            courseConfig.sections.splice(idx, 1);
        }
        document.querySelector(`#${courseCode} span`).innerText = courseConfig.sections.join(", ");
        // si no queda nada, se borra el curso
        if(!courseConfig.sections.length) {
            this.config.courses = this.config.courses.filter(course => course.courseCode !== courseConfig.courseCode);
            document.getElementById(courseCode).remove();
        }

        this.setConfig() // Actualiza la config
    }


    /**
     * Añade el curso a la lista "my-courses" de la interfaz
     * @param {string} courseCode código del curso
     * @param {number} courseSection sección del curso
     * @param {number} credits número de créditos
     */
    showAddedCourse({
        courseCode,
        sections,
        credits,
    }) {
        let node = document.createElement("div");
        document.getElementById("my-courses").prepend(node);
        node.id = courseCode;
        node.classList.add("my-course");
        let h3 = document.createElement("h3");
        const title = this.viewModel.getCourseSections({courseCode})[0].title;
        h3.innerText = title + " - " + courseCode;
        node.appendChild(h3);
        let container = document.createElement("div");
        container.classList.add("container-row")
        node.appendChild(container);
        let p = document.createElement("p");
        let strong = document.createElement("strong");
        strong.innerText = "Secciones: "
        let span = document.createElement("span");
        span.innerText = sections.join(", ");
        p.appendChild(strong);
        p.appendChild(span);

        let creditsContainer = document.createElement("p");
        let creditsText = document.createElement("strong");
        let creditsNum = document.createElement("span");
        creditsText.innerText = "Créditos: "
        creditsNum.innerText = credits
        creditsContainer.appendChild(creditsText);
        creditsContainer.appendChild(creditsNum);

        container.appendChild(p);
        container.appendChild(creditsContainer);

        // Boton que elimina el curso desde el que se pulsa
        let btn = document.createElement("button");
        btn.classList.add("btn-remove-course");
        btn.innerText = "Eliminar";
        btn.addEventListener('click', () => {
            document.querySelectorAll(`#course-options > div > h2`).forEach(node => {
                if(node.innerText === title) {
                    node.parentElement.classList.remove('selected-option');
                }
            });
            node.remove();
            this.config.courses = this.config.courses.filter(course => course.courseCode !== courseCode);
            this.setConfig()
        });
        node.appendChild(btn);
    }


    /**
     * Elimina todos los cursos de la configuración
     */
    resetCourses() {
        this.config.courses=[] //Elimina la lista de cursos

        // Elimina todos los hijos
        const myCourses = document.getElementById("my-courses");
        while (myCourses.firstChild && myCourses.firstChild.id !== "btn-reset-courses") {
            myCourses.removeChild(myCourses.firstChild);
        }

        document.querySelectorAll(".course-option").forEach(element => element.classList.remove("selected-option")); //Hace que los cursos seleccionados restauren su color

        this.setConfig() // Actualiza la config
    }


    /**
     * Cambia la métrica de optimización
     */
    changeMetric() {

        this.config.metric = document.querySelector('input[name="optimizar"]:checked').value;
        this.setConfig() // Actualiza la config
    }


    /**
     * Guarda la configuración en el localStorage
     */
    setConfig() {
        // Convierte el objeto en string
        localStorage.setItem('Mi-Horario-Uniandes-config', JSON.stringify(this.config));
    }


    /**
     * Recupera la configuración del localStorage
     */
    getConfig() {
        // Lee el string y lo convierte de nuevo a un objeto, si está definido
        let config = localStorage.getItem('Mi-Horario-Uniandes-config');
        if(config) return JSON.parse(config);
        // Si no está definido, crea una nueva config
        return {
            courses : [],
            blocks : [],
            metric : "MinHuecos",  // Valor por defecto
        };
    }
}


export { View };
