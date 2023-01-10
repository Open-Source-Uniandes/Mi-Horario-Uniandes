/* 
Este módulo interactúa con la interfaz del calendario
*/

import { TimeBlock } from "../model/TimeBlock.mjs";

class CalendarView {

    static COLORS = ["#E1628B", "#9595ff", "#C78A6B", "#E1A557", "#67A6D4", "#A05CD4", "#82BA6D", "#62E1C9"];

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
        this.calendarWidth = this.calendarDOM.style.width;
        this.calendarHeight = this.calendarDOM.style.height;
    }

    showTimeBlock(timeBlock, day, color) {

        const {
            startTime, // Como instante, es decir, minutos desde el inicio del día
            duration,  // En minutos
        } = timeBlock;

        // Calcular el offset
        const top = (startTime - this.timeZero) * this.calendarHeight / this.timeSpan;
        const left = this.day2idx[day] * this.calendarWidth / totalDays;
        const height = duration * this.calendarHeight / this.timeSpan;

        // Crear el nodo y agregarlo al DOM
        const node = document.createElement("div");
        node.classList.add("time-block");
        node.style.top = top;
        node.style.left = left;
        node.style.height = height;
        node.style.backgroundColor = color;
        this.calendarDOM.appendChild(node);
    }

    showSchedule(schedule) {
        // Agregar colores no repetidos...
    }

    clearCalendar() {
        while (this.calendarDOM.firstChild)
            this.calendarDOM.removeChild(this.calendarDOM.firstChild);
    }
}

export { CalendarView };