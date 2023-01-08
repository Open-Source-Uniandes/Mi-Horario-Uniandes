/* 
Este módulo se encarga de leer y procesar la información de la API
*/

class DataModel {

    // Endpoint de cursos registrados en Banner
    static API = 'https://ofertadecursos.uniandes.edu.co/api/courses';

    // Devuelve fecha de la última carga de datos, o undefined si no existe
    lastDataTime() {
        const lastTime = localStorage.getItem('Uniandes-lastDataTime');
        return lastTime;
    }

    // Devuelve los últimos datos cargados
    // Los datos deben existir en localStorage
    getData() {
        const dataModel = localStorage.getItem('Uniandes-dataModel');
        return JSON.parse(dataModel);
    }

    // Vuelve a cargar los datos desde la API y los guarda en localStorage
    async reloadData() {

        // Obtener datos (aprox 20 segundos)
        const lastTime = new Date().toLocaleString();
        const dataModel = await fetch(DataModel.API)
            .then(response => response.json())
            .then(response => JSON.stringify(response));

        // Guardarlos en localStorage
        localStorage.setItem('Uniandes-dataModel', dataModel)
        localStorage.setItem('Uniandes-lastDataTime', lastTime)
    }
}

export { DataModel };