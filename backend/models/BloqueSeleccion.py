from pydantic import BaseModel
from models.Seccion import Seccion
from models.BloqueTiempo import BloqueTiempo


class BloqueSeleccion(BaseModel):
    secciones: list[Seccion] = []
    bloquesLibres: list[BloqueTiempo] = []
