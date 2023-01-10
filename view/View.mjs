/* 
Este módulo maneja la interacción con la interfaz
*/

import { CalendarView } from "./CalendarView.mjs";
class View {

    constructor(viewModel) {
        // Guarda una referencia del view model para invocar sus métodos
        this.viewModel = viewModel;
        // Manejo de secciones específicas
        this.calendarView = new CalendarView({
            days : ["l", "m", "i", "j", "v", "s"],
            startTime : "0600",
            endTime : "2100",
        });
    }

    // Establece la interfaz como lista para ejecutarse
    ready() {
        // Eliminar animación de carga
        document.querySelector("#load-start").classList.add("inactive");
        // Mostrar botón de continuar
        document.querySelector("#btn-start").classList.remove("inactive");
        document.querySelector("#btn-start").addEventListener('click', this.openConfig.bind(this));
    }

    // Abre el modal de configuración
    openConfig() {
        // Cerrar otros modales y abrir configuración
        document.querySelector("#welcome").classList.add("inactive");
        document.querySelector("#calendar").classList.add("inactive");
        document.querySelector("#config").classList.remove("inactive");
    }

    // Abre el modal del calendario
    openCalendar() {
        // Cerrar otros modales y abrir calendario
        document.querySelector("#welcome").classList.add("inactive");
        document.querySelector("#config").classList.add("inactive");
        document.querySelector("#calendar").classList.remove("inactive");
    }
}

export { View };