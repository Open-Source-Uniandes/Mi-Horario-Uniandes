from pydantic import BaseModel
from abc import ABC, abstractmethod
from models.Seccion import Seccion

class FiltroSecciones(BaseModel, ABC):
    @abstractmethod
    def filtrar(self, seccion: Seccion)->bool:
        pass
    