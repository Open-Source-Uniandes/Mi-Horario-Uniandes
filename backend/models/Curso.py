from __future__ import annotations
from pydantic import BaseModel


class Curso(BaseModel):
    programa: str
    curso: str
    creditos: int
    atributos: list[str] = []
    descripcion: str
    secciones: list[Seccion] = []
  

    def __hash__(self):
        return hash((self.programa,self.curso))
    

# importaciones inferiores para evitar dependencias circulares
from models.Seccion import Seccion


Curso.model_rebuild()
