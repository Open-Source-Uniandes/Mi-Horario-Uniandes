/* 
Este módulo interactúa con la interfaz del calendario para mostrar la información
*/

import { Schedule } from "../model/Schedule.mjs";
import { TimeBlock } from "../model/TimeBlock.mjs";

class CalendarView {

    // Constantes de tiempo que debe mostrar el calendario
    static days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    static startTime = "0600";  // Primer minuto del día
    static endTime = "2100";    // Último minuto del día
    static timeInterval = 30;   // Medida usada para dividir el calendario (minutos)

    // Cálculo de ancho y alto del span de tiempo
    // Se usará para transformar medidas de tiempo en coordenadas de píxeles
    static timeHeigth = TimeBlock.calculateDuration(CalendarView.startTime, CalendarView.endTime);
    static timeWidth = CalendarView.days.length;
    // Valor base del instante de inicio para calcular el desfase
    static timeZero = TimeBlock.calculateInstant(CalendarView.startTime);
    
    // Variables del DOM
    static calendarLayout = document.getElementById("calendar-view");
    static pixelHeigth = CalendarView.calendarLayout.style.height;
    static pixelWidth = CalendarView.calendarLayout.style.width;


    // Mostrar un bloque de tiempo en el día especificado
    static showTimeBlock(timeBlock, day) {

        let { startTime, duration } = timeBlock;
        startTime -= timeZero;  // Ajustar desfase

        // Convertir medidas de tiempo en píxeles
        startTime *= (CalendarView.pixelHeigth / CalendarView.timeHeigth);
        duration *= (CalendarView.pixelHeigth / CalendarView.timeHeigth);

        // Convertir el día en píxeles
        const day2idx = {
            "l" : 0, 
            "m" : 1, 
            "i" : 2, 
            "j" : 3, 
            "v" : 4, 
            "s" : 5, 
            "d" : 6,
        };
        day = day2idx[day] * (CalendarView.pixelWidth / CalendarView.timeWidth);

        // Crear el nodo y agregarlo al DOM
        const node = document.createElement("div");
        node.style.top = startTime;
        node.style.left = day;
        node.style.height = duration;
        node.style.width = pixelWidth / timeWidth;
        calendarLayout.appendChild(node);

    }

    // Mostrar un horario específico
    showSchedule(schedule) {

    }

    // Limpiar el contenido preservando el layout
    clear() {

    }

}









/*
Me da:
lista de cursos, con opciones ej:

NECESITO:
- Responsive y para mobile nuevos controles ?
- Elementos del DOM
- Interactuar con el view model y pasarle los parámetros requeridos
- Canvas o algo similar donde dibujar dinámicamente los recuadros de horario
showSchedule, clearSchedule
- Event Listeners, en particular iniciar la app
*/



export { CalendarView };