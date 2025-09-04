from src.Transporte import Transporte

class Metro(Transporte):
    def __init__(self, linea: str, paradas: int, horario: str):
        super().__init__("Metro", 2500)
        self.linea = linea
        self.horario = horario
        self.paradas = paradas

    def info(self)-> str:
        """
        Retorna la información del Metro.
        """
        return f"{self.nombre} --- \nHorario {self.horario} \nLínea {self.linea} \nParadas {self.paradas}"