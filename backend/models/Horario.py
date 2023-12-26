from pydantic import BaseModel
from models.Seccion import Seccion
from models.BloqueSeleccion import BloqueSeleccion


class Horario(BaseModel):
    id: int
    bloquesSeleccion: list[BloqueSeleccion]
