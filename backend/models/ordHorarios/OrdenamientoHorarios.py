from pydantic import BaseModel
from abc import ABC, abstractmethod
from models.Horario import Horario

class OrdenamientoHorarios(BaseModel, ABC):
    @abstractmethod
    def ordenar(self, horarios: list[Horario])->None:
        pass
