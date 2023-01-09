/* 
Clase que representa un horario.
Un horario es una colección de bloques de tiempo.
Puede representar el horario de una sola CourseSection o de varias.
*/

import { TimeBlock } from "./TimeBlock.mjs";

class Schedule {

    // Se usa la misma convención de días de Banner
    static DAYS_OF_THE_WEEK = ["l", "m", "i", "j", "v", "s", "d"];

    // Se crea un array para guardar los TimeBlocks de cada día de la semana
    timeBlocks = Object.fromEntries(
        Schedule.DAYS_OF_THE_WEEK.map(day => [day, []])
    );
    
    // schedules es un array con todos los posibles bloques de tiempo 
    constructor(schedules) {

        schedules?.forEach(schedule => {

            // Ignorar schedules que no tengan hora de inicio o de fin
            if(!schedule.time_ini || !schedule.time_fin) return;

            // Hallar días válidos para el schedule
            const days = Schedule.DAYS_OF_THE_WEEK.filter(day => schedule[day]);

            // Agregar el TimeBlock al día que corresponda
            days.forEach(day => this.timeBlocks[day].push(new TimeBlock(schedule)));
        })
    }

    // Booleano que indica si el horario es válido 
    isValid() {
        const isOverlapped = Object.values(this.timeBlocks)
            // Si al menos un par de TimeBlocks hacen overlap en un mismo día, no es válido 
            .some(timeBlocksArray => this.#checkCollision(timeBlocksArray));
        return !isOverlapped;
    }

    // Valida colisiones (overlapping) entre TimeBlocks del Array
    #checkCollision(timeBlocksArray) {

        // Ordenar el Array ascendentemente según startTime
        timeBlocksArray = timeBlocksArray.sort((a, b) => (a.startTime - b.startTime));

        // Comparar elementos consecutivos: posterior (i) y anterior (i-1) 
        for(let i = 1; i < timeBlocksArray.length; i++) 

            // Si el elemento posterior empieza antes de que acabe el anterior
            if(timeBlocksArray[i].startTime < timeBlocksArray[i-1].endTime)

                // Hay colisión
                return true;

        // Si no se encuentra ningún caso, no hay colisión
        return false;
    }

    // Crea un único horario a partir de varios horarios
    // schedulesArray es un array de schedules, as described above
    static merge(...schedulesArray) {

        // Crea un horario vacío
        const merged = new Schedule;

        // Llena la información de todos los schedules
        merged.timeBlocks = schedulesArray.reduce(
            // Crea un objeto
            (previous, current) => Object.fromEntries(
                // Para cada día de la semana
                Schedule.DAYS_OF_THE_WEEK.map(
                    // Que contiene el valor anterior y el valor actual
                    day => [day, [...previous[day], ...current[day]]]
                )
            // Inicializa con el Object de empty arrays del nuevo horario
            ), merged.timeBlocks
        );

        return merged;
    }

    // Getters para "l", "m", "i", etc.
}

export { Schedule };