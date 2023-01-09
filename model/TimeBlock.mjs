/* 
Representa un bloque de tiempo como minutos desde el inicio del día.
*/
class TimeBlock {

    constructor({
        time_ini : startTime,
        time_fin : endTime,
        // startTime : time_ini,
        // endTime : time_fin,
        // information, // Objecto con detalles adicionales del bloque
    }) {
        this.startTime = calculateInstant(startTime);
        this.endTime = calculateInstant(endTime);
        this.duration = calculateDuration(startTime, endTime);
        // this.information = information;
    }

    // Halla la cantidad de minutos desde el inicio del día
    // time en el formato "hhmm", por ejemplo "0920"
    calculateInstant(time) {
        
        const hour = +time.slice(0,2);
        const minute = +time.slice(2,4);
        const instant = (hour * 60) + minute;
        return instant;
    }

    // Halla el tiempo en formato "hh:mm" a partir de un instante de tiempo
    calculateTime(instant) {
        
        const hour = Math.floor(instant / 60);
        const minute = instant % 60;
        const time = `${hour}:${minute}`;
        return time;
    }

    // Calcula la duración en minutos entre dos tiempos.
    // startTime < endTime
    calculateDuration(startTime, endTime) {

        // Halla la duración como una diferencia entre instantes de tiempo
        const startInstant = calculateInstant(startTime);
        const endInstant = calculateInstant(endTime);
        return endInstant - startInstant;
    }
}

export { TimeBlock };