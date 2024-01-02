# main.py
import asyncio, requests, pymongo, logging
from . import settings
from fastapi.responses import JSONResponse
from fastapi import FastAPI, BackgroundTasks
from errors.errors import *
from models.Profesor import Profesor
from models.Curso import Curso
from models.Seccion import Seccion

app = FastAPI()

@app.get("/")
def periodic_fetch_horarios():
    """
    Constantemente obtiene el horario, lo guarda en memoria y en la base de datos local
    """

    response = get_horarios_oferta()

    # respuesta válida
    if response is not None:
        if save_horarios_oferta(response) is None:
            print("Periodic Fetch: Base de datos inalcanzable")
        parse_horarios_oferta(response)
    else:
        print("Periodic Fetch: Respuesta errónea de la oferta de cursos.")


def get_horarios_oferta():
    """
    Recupera toda la lista de horarios de la API de courses
    """
    print("Periodic Fetch: Obteniendo horarios...")

    try:
        # Make the request directly using FastAPI's `HTTPException` for better error handling
        response = requests.get(settings.API_COURSES)
        response.raise_for_status()  # Raise HTTPError for bad responses (non-2xx status codes)

        # Parse the JSON response
        json_data = response.json()

        # Modify the data if needed
        # ...

        # Return the modified JSON data as a FastAPI JSONResponse
        return json_data
    
    except requests.RequestException as e:
        # Handle any request-related exceptions
        return None
    

def save_horarios_oferta(json_data)->None:
    """
    Guarda los horarios en una base de datos local en caso de que no haya conexión a Oferta de Cursos
    """
    print("Periodic Fetch: Guardando respuesta...")

    try:
        url = settings.DATABASES.get("default").get("URL")
        db_name = settings.DATABASES.get("default").get("DATABASE_NAME")
        collection_name = settings.DATABASES.get("default").get("COLLECTION")

        client = pymongo.MongoClient(url)
        # accede a la base de datos
        db = client[db_name]
        # accede a la colección
        collection = db[collection_name]
        # borra la colección
        collection.delete_many({})
        # inserta todos los cursos
        collection.insert_many(json_data)
        # cierra la conección
        client.close()
    except:
        return None


def parse_horarios_oferta(json_data)->None:
    """
    Parsea los horarios en una base de datos local
    """
    print("Periodic Fetch: Parseando respuesta...")

    # crea a los profesores
    profesoresRaw = set()
    for s in json_data:
        for p in s.get("instructors"):
            profesoresRaw.add(p.get("name"))

    settings.PROFESORES = {p: Profesor(nombre=p) for p in profesoresRaw}

    # crea los cursos
    cursosRaw = set([
        Curso(
            programa=c.get("class"),
            curso=c.get("course"),
            creditos=c.get("credits"),
            atributos=c.get("attrs"),
            # TODO: dónde se consigue la descripción?
            descripcion=""
        ) for c in json_data])
    settings.CURSOS = {c.programa + c.curso: c for c in cursosRaw}
    
    settings.SECCIONES = [
        Seccion(s) for s in json_data
    ]


async def read_root(background_tasks: BackgroundTasks):
    """
    Qué hace esta app
    """
    # Schedule the periodic_task to run in the background
    background_tasks.add_task(periodic_fetch_horarios)
    return {"message": "Task scheduled"}
