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

export function tiempoNumeroATexto(tiempo: number) {
  let minutos = tiempo % 100;
  let horas = Math.floor(tiempo / 100);
  return `${horas}:${minutos}`;
}