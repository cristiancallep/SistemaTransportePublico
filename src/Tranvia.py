from src.Transporte import Transporte

class Tranvia(Transporte):
    def __init__(self, linea: str, capacidad: int, paradas: int):
        super().__init__("Tranvía", 2700)
        self.linea = linea
        self.capacidad = capacidad
        self.paradas = paradas

    def info(self) -> str:
        """
        Retorna la información del Tranvia.
        """
        return f"{self.nombre} --- \nLínea {self.linea} \nCapacidad {self.capacidad} \nParadas {self.paradas}"