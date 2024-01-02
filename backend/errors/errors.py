"""
    Errores personalizados
"""

from datetime import datetime
from pydantic import BaseModel


class Error(BaseModel):
    nombre: str
    timestamp: datetime
    descripcion: str
    codigo: int
