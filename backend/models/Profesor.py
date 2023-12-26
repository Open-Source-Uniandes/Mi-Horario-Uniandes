from pydantic import BaseModel


class Profesor(BaseModel):
    nombre: str
    principal: bool
