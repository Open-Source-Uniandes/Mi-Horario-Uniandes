# main.py
import asyncio, requests, pymongo, logging
from . import settings
from bson.json_util import dumps
from json import loads
from fastapi.responses import JSONResponse
from fastapi import FastAPI, BackgroundTasks
from errors.errors import *
from models.Profesor import Profesor
from models.Curso import Curso
from models.Seccion import Seccion
from models.BloqueTiempo import BloqueTiempo

app = FastAPI()

@app.get("/fetch")
def periodic_fetch_horarios():
    """
    Constantemente obtiene el horario, lo guarda en memoria y en la base de datos local
    """

    response = get_horarios_oferta()

    data = {"fetch_code": 503, "parse_code": 500, "dump_code": 503}

    # no recuperó los datos
    if response is not None:
        data["fetch_code"] = 200
        data["dump_code"] = save_horarios_oferta(response).status_code
        data["parse_code"] = parse_horarios_oferta(response).status_code
    
    return JSONResponse(content=data, status_code=200)


def get_horarios_oferta():
    """
    Recupera toda la lista de horarios de la API de courses
    """
    #print("Periodic Fetch: Obteniendo horarios...", end="")

    try:
        # Make the request directly using FastAPI's `HTTPException` for better error handling
        response = requests.get(settings.API_COURSES)
        response.raise_for_status()  # Raise HTTPError for bad responses (non-2xx status codes)

        # Parse the JSON response
        json_data = response.json()

        # Modify the data if needed
        # ...

        # Return the modified JSON data as a FastAPI JSONResponse
    

        # TODO: cambiar para que sea JSONResponse
        return json_data
    
    except requests.RequestException as e:
        print(e)
        # Handle any request-related exceptions
        return None
    

def get_horarios_backup():
    """
    Recupera toda la lista de horarios de la base de datos de respaldo
    """
    try:
        url = settings.DATABASES.get("default").get("URL")
        db_name = settings.DATABASES.get("default").get("DATABASE_NAME")
        collection_name = settings.DATABASES.get("default").get("COLLECTION")

        client = pymongo.MongoClient(url)
        # accede a la base de datos
        db = client[db_name]
        # accede a la colección
        collection = db[collection_name]

        cursor = collection.find()
        json_list = [loads(dumps(doc)) for doc in cursor]
        # cierra la conección
        client.close()

        return json_list
    
    except Exception as e:
        print(e)    
        return None


def save_horarios_oferta(json_data):
    """
    Guarda los horarios en una base de datos local en caso de que no haya conexión a Oferta de Cursos
    """
    #print("Periodic Fetch: Guardando respuesta...", end="")

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

        return JSONResponse(content={}, status_code=200)
    
    except Exception as e:
        print(e)    
        return JSONResponse(content={}, status_code=500)


def parse_horarios_oferta(json_data):
    """
    Parsea los horarios en una base de datos local
    """
    #print("Periodic Fetch: Parseando respuesta...", end="")

    try:
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
                atributos=[d["code"] for d in c.get("attr")],
                descripcion="",
                secciones=[]
            ) for c in json_data])
        settings.CURSOS = {c.programa + c.curso: c for c in cursosRaw}


        horariosRaw = dict()
        for rawDict in json_data:
            horariosSeccion = list()
            for h in rawDict.get("schedules"):
                bt = BloqueTiempo(
                        lugar=h.get("classroom"), 
                        titulo=rawDict.get("title"),
                        ocupado=0
                    )
                bt.calcularOcupacion(h)
                horariosSeccion.append(bt)

            horariosRaw[rawDict.get("llave")] = horariosSeccion


        # crea los horarios
        formato_fecha = "%Y-%m-%d %H:%M:%S"
        settings.SECCIONES = [
            Seccion(
                nrc=rawDict.get("nrc"),
                seccion=rawDict.get("section"),
                titulo=rawDict.get("title"),
                cuposMaximos=rawDict.get("maxenrol"),
                cuposTomados=rawDict.get("enrolled"),
                modalidad=rawDict.get("campus"),
                # esto se podría mejorar para que sea más preciso
                fechaInicio=datetime.strptime(rawDict.get("schedules")[0].get("date_ini"), formato_fecha),
                fechaFin=datetime.strptime(rawDict.get("schedules")[0].get("date_fin"), formato_fecha),
                curso=settings.CURSOS.get(rawDict.get("class") + rawDict.get("course")),
                profesores=[settings.PROFESORES.get(p.get("name")) for p in rawDict.get("instructors")],
                horarios=horariosRaw.get(rawDict.get("llave"))
                
            ) for rawDict in json_data
        ]


        # exitoso
        return JSONResponse(content={}, status_code=200)

    except Exception as e:
        print(e)
        return JSONResponse(content={}, status_code=500)


@app.get("/secciones")
def get_secciones()->list[Seccion]: 
    """
    Retorna las secciones parseadas
    """
    # ya se cargó
    if len(settings.SECCIONES) > 0:
        return settings.SECCIONES
    # toca cargarlo de la base de datos
    else:
        json_data = get_horarios_backup()
        
        # no se cargó
        if len(json_data) == 0 :
            return JSONResponse(content={}, status_code=404)
        
        # exitoso
        if parse_horarios_oferta(json_data).status_code == 200:
            return settings.SECCIONES
        # error en el parseo
        else:
            return JSONResponse(content={}, status_code=503)
    
