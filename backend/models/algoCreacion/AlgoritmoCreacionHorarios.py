from pydantic import BaseModel
from abc import ABC, abstractmethod
from models.Horario import Horario
from models.Seccion import Seccion

class AlgoritmoCreacionHorario(BaseModel, ABC):
    @abstractmethod
    def crearHorarios(self, secciones: list[Seccion])->list[Horario]:
        pass
    