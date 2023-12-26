from pydantic import BaseModel
from datetime import datetime
from models.Curso import Curso
from models.Profesor import Profesor
from models.BloqueTiempo import BloqueTiempo


class Seccion(BaseModel):
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