class Tarjeta:
    def __init__(self, nombre: str, documento: str):
        self.__nombre = nombre
        self.__documento = documento
        self.__saldo = 0  # saldo inicial siempre 0

    def modificar_saldo(self, monto: float) -> None:
        """
        Modifica el saldo de la tarjeta sumando el monto
        
        """
        self.__saldo += monto

    def get_saldo(self) -> float:
        return self.__saldo

    def get_documento(self) -> str:
        return self.__documento
    
    def get_nombre(self) -> str:
        return self.__nombre
