/* 
Este módulo lee la información de cursos de la API de Uniandes.
*/

// Constantes
const API = 'https://ofertadecursos.uniandes.edu.co/api/courses';

async function loadData() {
    console.log("Loading data")
    let data = await fetch(API)
        .then(response => response.json())
        .then(response => console.log(response))
}

loadData()