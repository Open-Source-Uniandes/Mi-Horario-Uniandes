from __future__ import annotations
from pydantic import BaseModel


class BloqueSeleccion(BaseModel):
    secciones: list[Seccion] = []
    bloquesLibres: list[BloqueTiempo] = []


from models.Seccion import Seccion
from models.BloqueTiempo import BloqueTiempo