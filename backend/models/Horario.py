from __future__ import annotations
from pydantic import BaseModel



class Horario(BaseModel):
    id: int
    bloquesSeleccion: list[BloqueSeleccion]


from models.Seccion import Seccion
from models.BloqueSeleccion import BloqueSeleccion