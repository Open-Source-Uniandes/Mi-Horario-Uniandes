from pydantic import BaseModel


class BloqueTiempo(BaseModel):
    ocupado: int
    lugar: str
    titulo: str

    _mapeo_dias: {
        'l' : 0,
        'm' : 30,
        'i' : 60,
        'j' : 90,
        'v' : 120,
        's' : 150
    }


    def __init__(self, lugar: str, titulo: str, horarios: list)->None:
        
        self.lugar = lugar
        self.titulo = titulo
        self.ocupado = 0

        for f in horarios:
            time_ini = 2*(int(f.get("time_ini")[0:2])-6) + int(f.get("time_ini")[2:])//30
            time_fin = 2*(int(f.get("time_fin")[0:2])-6) + (int(f.get("time_fin")[2:])-20)//30 + 1

            for ch in 'lmijvsd':
                if f.get(ch) is not None:
                    time_ini_dia = time_ini + self._mapeo_dias.get(ch)
                    time_fin_dia = time_fin + self._mapeo_dias.get(ch)

                    self.ocupado += (1<<time_fin_dia) - (1<<time_ini_dia)
                
