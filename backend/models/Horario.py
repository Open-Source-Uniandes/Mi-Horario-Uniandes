from pydantic import BaseModel
from models.Seccion import Seccion
from models.BloqueSeleccion import BloqueSeleccion


class Horario(BaseModel):
    id: int
    secciones: list[Seccion] = []
    bloqueSeleccion: list[BloqueSeleccion] = []
