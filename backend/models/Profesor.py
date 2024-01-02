from pydantic import BaseModel


class Profesor(BaseModel):
    nombre: str

    def __hash__(self):
        return hash(self.name)
