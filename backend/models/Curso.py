from pydantic import BaseModel
from models.Seccion import Seccion


class Curso(BaseModel):
    programa: str
    curso: str
    creditos: int
    atributos: str
    descripcion: str
    secciones: list[Seccion] = []
