"""
    Errores personalizados
"""


class BadHorarioResponseException(Exception):
    def __init__(self):
        super().__init__("No se pudo recuperar el horario de Oferta de Cursos.")