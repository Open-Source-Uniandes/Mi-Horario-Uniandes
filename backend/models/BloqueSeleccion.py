from pydantic import BaseModel
from models.Seccion import Seccion
from models.BloqueTiempo import BloqueTiempo


class Horario(BaseModel):
    id: int
    secciones: list[Seccion] = []
    bloquesLibres: list[BloqueTiempo] = []
