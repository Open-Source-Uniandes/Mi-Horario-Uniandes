/* 
Este módulo interactúa con la interfaz del calendario
*/

import { TimeBlock } from "../model/TimeBlock.mjs";

class CalendarView {

    COLORS = ["#E1628B", "#9595ff", "#C78A6B", "#E1A557", "#67A6D4", "#A05CD4", "#82BA6D", "#62E1C9"];

    constructor({
        days, // Array para mapear días en índices, en orden
        startTime, // Hora de inicio del calendario
        endTime, // Hora de fin del calendario
    }) {
        // Conversión de tiempo a píxeles
        this.timeSpan = TimeBlock.calculateDuration(startTime, endTime); // Rango de tiempo que almacena el calendario
        this.timeZero = TimeBlock.calculateInstant(startTime); // Valor base del instante de inicio para calcular el desfase
        this.day2idx = Object.fromEntries(days.map((day, idx) => [day, idx]));
        this.totalDays = days.length;

        // Variables del DOM
        this.calendarDOM = document.querySelector(".table-content");
        this.calendarWidth = this.calendarDOM.clientWidth;
        this.calendarHeight = 15*40;

        // Cíclo de colores
        this.idxCurrentColor = 0;
    }

    showTimeBlock(timeBlock, day, color, courseSection) {

        const {
            startTime, // Como instante, es decir, minutos desde el inicio del día
            duration,  // En minutos
        } = timeBlock;

        // Calcular el offset
        const top = (startTime - this.timeZero) * this.calendarHeight / this.timeSpan;
        const left = this.day2idx[day] * this.calendarWidth / this.totalDays;
        const height = duration * this.calendarHeight / this.timeSpan;

        // Crear el nodo y agregarlo al DOM
        const node = document.createElement("div");
        node.classList.add("time-block");
        node.style.top = top + "px";
        node.style.left = left + "px";
        node.style.height = height + "px";
        node.style.backgroundColor = color;
        this.calendarDOM.appendChild(node);

        // Añadir texto
        let p = document.createElement("p");
        if(courseSection) {
            p.innerText = `${courseSection.courseCode}\nSección ${courseSection.section}`;
        }
        else {
            p.innerText = "Bloque de tiempo reservado";
        }
        node.appendChild(p);
    }

    // Muestra un Schedule de bloque 
    showBlocks(blocks) {
        const color = "var(--light-gray)";

        blocks.forEach(block => {
            let timeBlock = TimeBlock.fromInstants({time_ini: block.startTime, time_fin: block.endTime});
            block.days.forEach(day => this.showTimeBlock(timeBlock, day, color))
        });
    }

    // Muestra un Schedule de un Course Section
    showCourseSchedule(courseSection) {
        
        const color = this.COLORS[this.idxCurrentColor];
        Object.entries(courseSection.schedule.timeBlocks).forEach(
            ([day, timeBlocks]) => timeBlocks.forEach(
                timeBlock => this.showTimeBlock(timeBlock, day, color, courseSection)
            )
        );

        // Ciclo de colores
        this.idxCurrentColor = (this.idxCurrentColor + 1) % this.COLORS.length;
    }

    // Limpia todos los objetos en el calendario
    clearCalendar() {
        // Recalcular variables
        this.calendarWidth = this.calendarDOM.clientWidth;

        while (this.calendarDOM.firstChild)
            this.calendarDOM.removeChild(this.calendarDOM.firstChild);
    }
}

export { CalendarView };