// Clase principal para manejo de la vista
import { View } from "./view/View.mjs";
const view = new View();

// Empieza a ejecutar incluso antes de cargar imágenes y CSS
// Bind se asegura que se llame la función en el contexto del view
window.addEventListener('DOMContentLoaded', view.start.bind(view));  