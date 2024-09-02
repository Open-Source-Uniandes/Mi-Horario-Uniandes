/*
  Este servicio permite realizar operaciones con tiempos
*/

/*
  Convierte un tiempo en formato HHMM (hora militar) a minutos
*/
export function tiempoAMinutos(tiempo: number) {
  let minutos = tiempo % 100;
  let horas = Math.floor(tiempo / 100);
  return horas * 60 + minutos;
}

/*
  Convierte un tiempo en minutos a formato HHMM (hora militar)
*/
export function tiempoNumeroATexto(tiempo: number) {
  let minutos = tiempo % 100;
  let horas = Math.floor(tiempo / 100);
  return `${horas}:${minutos.toString().padStart(2, '0')}`;
}

/*
  Convierte un tiempo en minutos en pixeles para mostrarlo en el calendario

  1 minuto = 0.75px
*/
export function tiempoAPixeles(tiempo: number) {
  return Math.floor((tiempoAMinutos(tiempo) - tiempoAMinutos(600)) * 0.75)
}