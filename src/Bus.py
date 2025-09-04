from src.Transporte import Transporte

class Bus(Transporte):
    def __init__(self,capacidad: int, paradas: int, horario: str, tipo:str):
        super().__init__("Bus", 3000)
        self.capacidad = capacidad
        self.paradas = paradas
        self.horario = horario
        self.tipo = tipo

    def info(self) -> str:
        """
        Retorna la información del bus.
        """
        return f"{self.nombre} --- \nHorario {self.horario}\nCapacidad {self.capacidad}\nParadas {self.paradas}\nTipo {self.tipo}"