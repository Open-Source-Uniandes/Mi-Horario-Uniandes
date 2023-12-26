from pydantic import BaseModel


class BloqueTiempo(BaseModel):
    ocupado: int
    lugar: str
    titulo: str
