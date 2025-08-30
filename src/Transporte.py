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

    def info(self):
        return f"{self.nombre} - Línea {self.linea}, Capacidad {self.capacidad}, Paradas {self.paradas}"
