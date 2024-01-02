from pydantic import BaseModel
from models.Seccion import Seccion


class Curso(BaseModel):
    programa: str
    curso: str
    creditos: int
    atributos: list[str] = []
    descripcion: str
    secciones: list[Seccion] = []


    def __hash__(self):
        return hash((self.programa,self.curso))