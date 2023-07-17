/**
 * Representa un bloque de tiempo, con un inicio y un fin.
 */

class TimeBlock {

    /**
     * @param {string} startTime tiempo de inicio en formato "HHMM" (i.e. "0920")
     * @param {string} endTime tiempo de fin en formato "HHMM" (i.e. "0920")
     */
    constructor({
        time_ini : startTime,
        time_fin : endTime,
    }) {
        this.startTime = TimeBlock.calculateInstant(startTime);
        this.endTime = TimeBlock.calculateInstant(endTime);
        this.duration = TimeBlock.calculateDuration(startTime, endTime);
    }


    /**
     * @returns {string} bloque de tiempo en formato "HH:MM - HH:MM"
     * @override
     */
    toString() {
        return `${TimeBlock.calculateTime(this.startTime)} - ${TimeBlock.calculateTime(this.endTime)}`
    }


    /**
     * Retorna un bloque de tiempo a partir de un tiempo de inicio y un tiempo de fin
     * @param {*} startTime tiempo de inicio en formato "HHMM" (i.e. "0920")
     * @param {*} endTime tiempo de fin en formato "HHMM" (i.e. "0920")
     * @returns {TimeBlock} bloque de tiempo
     */
    static fromInstants({
        time_ini : startTime,
        time_fin : endTime,
    }) {
        let timeBlock = new TimeBlock({time_ini: "0000", time_fin: "0000"});
        timeBlock.startTime = startTime;
        timeBlock.endTime = endTime;
        timeBlock.duration = endTime - startTime;
        return timeBlock;
    }


    /**
     * Halla la cantidad de minutos desde el inicio del día
     * time en el formato "HHMM", por ejemplo "0920"
     * @param {*} time tiempo en el formato "HHMM" (i.e. "0920")
     * @returns {number} minutos desde el inicio del día
     */
    static calculateInstant(time) {

        const hour = +time.slice(0,2);
        const minute = +time.slice(2,4);
        const instant = (hour * 60) + minute;
        return instant;
    }


    /**
     * Retorna el tiempo en formato "HH:MM" a partir de un instante de tiempo
     * @param {number} instant instante de tiempo
     * @returns {string} tiempo en formato "HH:MM"
     */
    static calculateTime(instant) {

        const hour = Math.floor(instant / 60);
        const minute = String(instant % 60).padStart(2, '0');  // Padding para casos como '0'
        const time = hour + ":" + minute;
        return time;
    }


    /**
     * Calcula la duración entre dos instantes de tiempo
     * @param {*} startTime tiempo inicial
     * @param {*} endTime tiempo final
     * @returns {number} minutos de diferencia entre los dos instantes
     */
    static calculateDuration(startTime, endTime) {

        // Halla la duración como una diferencia entre instantes de tiempo
        const startInstant = TimeBlock.calculateInstant(startTime);
        const endInstant = TimeBlock.calculateInstant(endTime);
        return endInstant - startInstant;
    }
}

export { TimeBlock };