from __future__ import annotations
from pydantic import BaseModel
from datetime import datetime


class Seccion(BaseModel):
    nrc: int
    seccion: int
    titulo: str
    cuposMaximos: int
    cuposTomados: int
    modalidad: str
    fechaInicio: datetime
    fechaFin: datetime
    curso: Curso
    profesores: list[Profesor] = []
    horarios: list[BloqueTiempo] = []

    
    """ def __init__(self, rawDict: dict, cursos: dict, profs: dict)->None:
        self.seccion = rawDict.get("section")
        self.titulo = rawDict.get("title")
        self.cuposMaximos = rawDict.get("maxenrol")
        self.cuposTomados = rawDict.get("enrolled")
        self.modalidad = rawDict.get("campus")

        formato_fecha = "%Y-%m-%d %H:%M:%S"
        self.fechaInicio = datetime.strptime(rawDict.get("date_ini"))
        self.fechaFin = datetime.strptime(rawDict.get("date_fin"))

        # supone que ya existe el curso para esta materia
        self.curso = cursos.get(rawDict.get("class") + rawDict.get("course"))

        # supone que ya existen los profesores para esta materia
        for p in rawDict.get("instructors"):
            self.profesores.append(profs.get(p.get("name")))
        
        horarios = BloqueTiempo(rawDict.get("schedules")) """


# importaciones inferiores para evitar dependencias circulares
from models.Curso import Curso
from models.Profesor import Profesor
from models.BloqueTiempo import BloqueTiempo

Seccion.model_rebuild()