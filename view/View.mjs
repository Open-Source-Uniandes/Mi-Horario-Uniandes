/* 
Este módulo centraliza la interacción con la interfaz
*/

import { ViewModel } from "../view-model/ViewModel.mjs";

class View {

    constructor() {

        // Crear modelo de la vista
        this.viewModel = new ViewModel();
        this.lastTime = null;  // Fecha de última actualización de los datos

        // Añadir event listeners
        document.querySelector("#btn-start").addEventListener('click', this.openConfig.bind(this));
    }

    // Se ejecuta al cargar la página 
    start() {
        this.lastTime = this.viewModel.loadData().then(time => {
            // Eliminar animación de carga
            document.querySelector("#load-start").classList.add("inactive");
            // Mostrar botón de continuar
            document.querySelector("#btn-start").classList.remove("inactive");
            
            return time;
        });
    }

    // Se ejecuta cuando el usuario decide continuar a armar su horario
    // O cuando decide cambiar la configuración
    openConfig() {

        // Cerrar modal de bienvenida, si está abierto
        document.querySelector("#welcome").classList.add("inactive");
        // Abrir modal de configuración
        document.querySelector("#config").classList.remove("inactive");
    }

    // Se ejecuta cuando el usuario ya ha definido la configuración
    openCalendar() {
        
        // Cerrar modal de configuración
        document.querySelector("#config").classList.add("inactive");
    }
}

export { View };