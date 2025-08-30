class Transporte:
    def __init__(self, nombre: str, costo: float):
        self.nombre = nombre
        self.costo = costo

    def vender_tiquete(self, tarjeta) -> bool:
        """
        Descuenta el valor del tiquete del saldo de la tarjeta.

        """
        if tarjeta.get_saldo() >= self.costo:
            tarjeta.modificar_saldo(-self.costo)
            return True
        else:
            return False


class Tranvia(Transporte):
    def __init__(self, linea: str, capacidad: int, paradas: int):
        super().__init__("Tranvía", 2700)
        self.linea = linea
        self.capacidad = capacidad
        self.paradas = paradas

    def info(self) -> str:
        return f"{self.nombre} --- \nLínea {self.linea} \nCapacidad {self.capacidad} \nParadas {self.paradas}"

class Bus(Transporte):
    def __init__(self,capacidad: int, paradas: int, horario: str, tipo:str):
        super().__init__("Bus", 3000)
        self.capacidad = capacidad
        self.paradas = paradas
        self.horario = horario
        self.tipo = tipo

    def info(self) -> str:
        return f"{self.nombre} --- \nHorario {self.horario}\nCapacidad {self.capacidad}\nParadas {self.paradas}\nTipo {self.tipo}"

class Metro(Transporte):
    def __init__(self, linea: str, paradas: int, horario: str):
        super().__init__("Metro", 2500)
        self.linea = linea
        self.horario = horario
        self.paradas = paradas

    def info(self)-> str:
        return f"{self.nombre} --- \nHorario {self.horario} \nLínea {self.linea} \nParadas {self.paradas}"
