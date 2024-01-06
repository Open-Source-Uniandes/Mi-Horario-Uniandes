"""
    Archivo de configuraciones para el fetcher
"""
from models.Profesor import Profesor
from models.Curso import Curso
from models.Seccion import Seccion

# URL de la API de Oferta de Cursos para hacer la petición
API_COURSES = "https://ofertadecursos.uniandes.edu.co/api/courses"

# Variable global de los profesores
PROFESORES = dict()
# Variable global de los cursos
CURSOS = dict()
# Variable global para las secciones
SECCIONES = dict()

# Variable global de la base de datos
DATABASES = {
    "default" : {
        "URL" : "mongodb://localhost:27017/",
        "DATABASE_NAME" : "dump",
        "COLLECTION" : "dump",
    }
}