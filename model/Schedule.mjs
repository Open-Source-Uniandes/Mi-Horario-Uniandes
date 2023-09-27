/**
 * Clase que representa un horario.
 * Un horario es una colección de bloques de tiempo.
 * Puede representar el horario de una sola CourseSection o de varias.
 */

import { TimeBlock } from "./TimeBlock.mjs";


class Schedule {
  
    // Se usa la misma convención de días de Banner
    static DAYS_OF_THE_WEEK = ["l", "m", "i", "j", "v", "s", "d"];
  
    timeBlocks = Object.fromEntries(
        Schedule.DAYS_OF_THE_WEEK.map(day => [day, []])
    );

    /**
     * @param {array} schedules array con todos los posibles bloques de tiempo
     * @param {string} ptrmdesc descripción del período académico (i.e PERIODO 202320 - 16 SEMANAS)
     * @throws {Error} si el periodo académico no se puede interpretar
     * @returns {Schedule}
     */
    constructor(schedules = [], ptrmdesc = "") {
        // Verificar entrada
        if(!Array.isArray(schedules)) {
            throw new Error("schedules must be an array");
        }
        
        // determina en qué ciclo se da la materia

        const descripcionCiclo = ptrmdesc.match(/^\w+/)[0];
        let ciclo = 0;

        if (descripcionCiclo === 'PRIMER') {
            ciclo = 1;
        }
        else if (descripcionCiclo === 'SEGUNDO') {
            ciclo = 2;
        }
        /**
         * PERIODO - 16 SEMANAS
         * DEPORTES - 16 SEMANAS
         * CURSOS - 21 SEMANAS (MEDICINA)
         * POSGRADO - 26 SEMANAS (MEDICINA)
         */
        else if (
            descripcionCiclo === 'PERIODO' ||
            descripcionCiclo === 'DEPORTES' ||
            descripcionCiclo === 'CURSOS' ||
            descripcionCiclo === 'POSGRADO' ||
            descripcionCiclo === 'POSGRADOS' ||
            descripcionCiclo === 'NODADO'
        ) {
            ciclo = 0;
        }
        else {
            throw new Error("No se pudo determinar el ciclo de la materia");
        }
       
        schedules.forEach(schedule => {
          
            // Ignorar schedules que no tengan hora de inicio o de fin
            if(!schedule.time_ini || !schedule.time_fin) return;
          
            // Hallar días válidos para el schedule
            const days = Schedule.DAYS_OF_THE_WEEK.filter(day => schedule[day]);
          
            // Agregar el TimeBlock al día que corresponda
            days.forEach(day => this.timeBlocks[day].push(new TimeBlock(schedule, ciclo)));

        })

        // Hacerlo válido (en ocasiones los bloques de tiempo de un mismo curso se superponen)
        Object.entries(this.timeBlocks)
            .forEach(([day, timeBlocksArray]) => this.timeBlocks[day] = this.#mergeBlocks(timeBlocksArray));
    }

    /**
     * @returns {boolean} true si el horario es válido, false de lo contrario
     */
    isValid() {
        const isOverlapped = Object.values(this.timeBlocks)
            // Si al menos un par de TimeBlocks hacen overlap en un mismo día, no es válido
            .some(timeBlocksArray => this.#checkCollision(timeBlocksArray));
        return !isOverlapped;
    }


    /**
     * Valida colisiones/overlapping entre TimeBlocks del Array
     * @param {array} timeBlocksArray 
     * @returns {boolean} true si hay colisión, false de lo contrario
     */
    #checkCollision(timeBlocksArray) {
        console.log("Revisando colisiones");

        // separa los time blocks por ciclo. Periodo completo va en ambos arreglos
        let timeBlocksCiclo1 = [];
        let timeBlocksCiclo2 = [];
        
        for (let block of timeBlocksArray) { 
            if (block.ciclo === 1 || block.ciclo === 0) timeBlocksCiclo1.push(block);
            if (block.ciclo === 2 || block.ciclo === 0) timeBlocksCiclo2.push(block);
        }

        // los ordena ascendentemente
        timeBlocksCiclo1 = timeBlocksCiclo1.sort((a, b) => (a.startTime - b.startTime));
        timeBlocksCiclo2 = timeBlocksCiclo2.sort((a, b) => (a.startTime - b.startTime));

        // Comparar elementos consecutivos: posterior (i) y anterior (i-1) 
        // TODO: puede estar mal. Proveer contraejemplo
        let hayColision = false;

        // ciclo 1
        for (let i=1; i<timeBlocksCiclo1.length && !hayColision; i++) {
            if (timeBlocksCiclo1[i].startTime < timeBlocksCiclo1[i-1].endTime) {
                hayColision = true;
            }
        }

        // ciclo 2
        for (let i=1; i<timeBlocksCiclo2.length && !hayColision; i++) {
            if (timeBlocksCiclo2[i].startTime < timeBlocksCiclo2[i-1].endTime) {
                hayColision = true;
            }
        }

        console.log("Finaliza revisión colisiones");
        // Si no se encuentra ningún caso, no hay colisión
        return hayColision;
    }

    /**
     * Crea un único horario a partir de varios horarios
     * @param {array} schedulesArray array de schedules
     * @returns {Schedule} horario unificado
     */
    static merge(schedulesArray) {
      
        // Verificar entrada
        if(!Array.isArray(schedulesArray)) {
            throw new Error("schedulesArray must be an array");
        }
      
        // Crea un horario vacío
        const merged = new Schedule([], 'NODADO');
      
         // Llena los bloques de los demás horarios
        schedulesArray.forEach(schedule => Object.entries(schedule.timeBlocks)
            .forEach(([day, blocks]) => merged.timeBlocks[day] = [...merged.timeBlocks[day], ...blocks]));
        return merged;
    }

    /**
     * Crea un horario válido a partir de un array de bloques de tiempo. Depura o combina time blocks de ser necesario
     * @param {Array} blocks array de bloques de tiempo
     * @returns {Schedule} horario unificado
     */
    static fromBlocks(blocks) {
      
        // Verificar entrada
        if(!Array.isArray(blocks)) {
            throw new Error("blocks must be an array");
        }
      
        const schedule = new Schedule([], "NODADO");
      
        // Recorrer cada día de cada bloque
        blocks.forEach(block => {
            const timeBlock = {time_ini: block.startTime, time_fin: block.endTime};
            block.days.forEach(day => {
                schedule.timeBlocks[day].push(TimeBlock.fromInstants(timeBlock));
            });
        });
        
        /*
        for (let block in blocks) {
            // periodo de tiempo del bloque
            const timeFrame = {
                time_ini: blocks[block].startTime, 
                time_fin: blocks[block].endTime
            };

            for (let day in block.days) {
                // agregar el bloque al dia correspondiente
                schedule.timeBlocks[day].push(new TimeBlock(timeBlock, 0));
            }
        }
        */
      
        // Hacerlo válido
        Object.entries(schedule.timeBlocks)
            .forEach(([day, timeBlocksArray]) => schedule.timeBlocks[day] = schedule.#mergeBlocks(timeBlocksArray));

        return schedule;
    }

    
    /**
     * Corrige el overlapping, borrando TimeBlocks de ser necesario
     * @param {array} timeBlocksArray arreglo de TimeBlocks
     * @returns {array} arreglo de TimeBlocks sin overlapping
     */
    #mergeBlocks(timeBlocksArray) {

        // Caso que no tiene elementos
        if(timeBlocksArray.length < 1) return timeBlocksArray;

        timeBlocksArray = timeBlocksArray
            // Ordenar el Array ascendentemente según startTime
            .sort((a, b) => (a.startTime - b.startTime))
            .reduce((acum, curr) => {
                // Último elemento añadido al array final
                let lastAdded = acum[acum.length - 1];
                // Si hay colisión con el actual, se incorpora al elemento ya añadido
                if(curr.startTime < lastAdded.endTime) lastAdded.endTime = Math.max(lastAdded.endTime, curr.endTime);
                // Si no hay colisión, simplemente se agrega
                else acum.push(curr);
                return acum;
            }, [timeBlocksArray[0]]);

        return timeBlocksArray;
    }
}

export { Schedule };
