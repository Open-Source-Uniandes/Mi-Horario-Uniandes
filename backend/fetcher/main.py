# main.py
import asyncio, requests
from . import settings
from fastapi.responses import JSONResponse
from fastapi import FastAPI, BackgroundTasks
from errors.errors import *

app = FastAPI()

async def periodic_fetch_horarios():
    """
    Constantemente obtiene el horario, lo guarda en memoria y en la base de datos local
    """
    while True:
        
        response = get_horarios_oferta()

        # respuesta válida
        if response is not None:
            save_horarios_oferta(response)
            settings.HORARIOS = parse_horarios_oferta(response)

        else:
            print("Periodic Fetch: Respuesta errónea de la oferta de cursos.")
        
        await asyncio.sleep(5)


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
        raise BadHorarioResponseException() from e
    
        return None
    

async def save_horarios_oferta(json_data)->None:
    """
    Guarda los horarios en una base de datos local en caso de que no haya conexión a Oferta de Cursos
    """
    print("Periodic Fetch: Guardando respuesta...")
    pass


async def parse_horarios_oferta(json_data)->list:
    """
    Parsea los horarios en una base de datos local
    """
    print("Periodic Fetch: Parseando respuesta...")
    pass


@app.get("/")
async def read_root(background_tasks: BackgroundTasks):
    """
    Qué hace esta app
    """
    # Schedule the periodic_task to run in the background
    background_tasks.add_task(periodic_fetch_horarios)
    return {"message": "Task scheduled"}
