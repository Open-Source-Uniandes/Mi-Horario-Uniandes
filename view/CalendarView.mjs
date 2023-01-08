/* 
Este módulo interactúa con la interfaz para mostrar la información
*/

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

/* USER PARAMETERS */
let myCourses = [
    {
        name: "ArquiEmp",
        code: "ISIS-2403",
    },
    {
        name: "Desarollo",
        code: "ISIS-2603",
    },
    {
        name: "Dalgo",
        code: "ISIS-1105",
       exclude: ["4"],
    },
    {
        name: "InfreTec",
        code: "ISIS-1304",
    },
    {
        name: "LyM",
        code: "ISIS-1106",
       exclude: ["1", "2"],
    },
    {
        name: "SisTrans",
        code: "ISIS-2304",
    },
    {
        name: "Maratones",
        code: "ISIS-2804",
    },
    {
        name: "Opti Avanzada",
        code: "IIND-4101",
        color: "#8A2BE2	",
    },
];

CalendarView = {};

export { CalendarView }