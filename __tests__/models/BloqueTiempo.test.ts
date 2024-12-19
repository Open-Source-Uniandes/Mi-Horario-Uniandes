import BloqueTiempo from "../../src/models/BloqueTiempo";

describe("BloqueTiempo Class", () => {
   it("crea una instancia de BloqueTiempo con los atributos correctos", () => {
       const ocupado = 12345;
       const lugar = "ML123";
       const titulo = "Libre";
       const dias = ["L", "I", "D"];
       const horaInicio = 1400;
       const horaFin = 1520;

       const bloqueTiempo = new BloqueTiempo(ocupado, lugar, titulo, dias, horaInicio, horaFin);
       expect(bloqueTiempo.ocupado).toBe(ocupado);
       expect(bloqueTiempo.lugar).toBe(lugar);
       expect(bloqueTiempo.titulo).toBe(titulo);
       expect(bloqueTiempo.dias).toBe(dias);
       expect(bloqueTiempo.horaInicio).toBe(horaInicio);
       expect(bloqueTiempo.horaFin).toBe(horaFin);
   });
});