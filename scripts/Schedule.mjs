/* 
Clase que representa un horario.
Un horario es una colección de bloques de tiempo.
*/

import { TimeBlock } from "./TimeBlock.mjs";

class Schedule {

    // Se usa la misma convención de días de Banner
    static DAYS_OF_THE_WEEK = ["l", "m", "i", "j", "v", "s", "d"];

    // Propiedad para almacenar el conjunto de bloques de cada día
    #timeBlocks = Object.fromEntries(
        DAYS_OF_THE_WEEK.map(day => [day, []])
    );

    // Propiedad para revisar si existe una colisión entre los bloques de tiempo
    #instantsOfTimeUsed = Object.fromEntries(
        DAYS_OF_THE_WEEK.map(day => [day, []])
    );

    // Añade los horarios de una sección de una materia/curso
    addCourseSectionTimeBlocks(courseSection) {

        // // Detalles adicionales de los nuevos TimeBlocks
        // const information = {
        //     courseCode,
        // };

        courseSection.schedules.forEach(schedule => {

            // Desempaquetar la información de un schedule
            const {
                time_ini,
                time_fin,
                building,
                classroom,
            } = schedule;

            // Hallar días válidos para el schedule
            const days = Schedule.DAYS_OF_THE_WEEK.filter(day => schedule[day]);
            days.forEach(day => {

                // Crear el TimeBlock
                const timeBlock = new TimeBlock({
                    startTime : time_ini,
                    endTime : time_fin,
                    information : courseSection,
                });
                timeBlocks[day].push(timeBlock);

                // Añadir los instantes de tiempo usados para verificar colisión
                // Se crea un rango de números entre los tiempos de inicio y fin
                // Se añaden estos elementos al array existente
                const range = [...Array(timeBlock.duration).keys()].map(i => i + timeBlock.startTime);
                instantsOfTimeUsed[day] = [...instantsOfTimeUsed[day], ...range];
            })
        });

    }

    // Revisa si el horario es válido, es decir, si no se cruza en ningún instante de tiempo
    // Un horario será válido si todos sus instantes de tiempo son únicos, es decir, no hay overlap
    isValid() {
        const arraysInstantsOfTimeUsed = Object.values(instantsOfTimeUsed);
        const isOneNotUnique = arraysInstantsOfTimeUsed.some(array => array.length !== new Set(array).size)
        return isOneNotUnique;
    }
}

export { Schedule };