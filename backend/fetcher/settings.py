"""
    Archivo de configuraciones para el fetcher
"""
from models.Profesor import Profesor
from models.Curso import Curso
from models.Seccion import Seccion

# URL de la API de Oferta de Cursos para hacer la petición
API_COURSES = "https://ofertadecursos.uniandes.edu.co/api/courses"

# Variable global de los profesores
PROFESORES = dict[Profesor]
# Variable global de los cursos
CURSOS = dict[Curso]
# Variable global para las secciones
SECCIONES = dict[Seccion]

# Variable global de la base de datos
DATABASES = {
    "default" : {
        "URL" : "mongodb://localhost:27018/",
        "DATABASE_NAME" : "dump",
        "COLLECTION" : "dump",
    }
}