from src.Tarjeta import Tarjeta

class GestorTarjeta:
    def __init__(self):
        self.__tarjetas = {}
        
    def get_targetas(self) -> dict:
        return self.__tarjetas

    def crear_tarjeta(self, nombre: str, documento: str) -> bool:
        """
        Crea una nueva tarjeta si el documento no existe.
        
        """
        if documento in self.__tarjetas:
            return False
        nueva = Tarjeta(nombre, documento)
        self.__tarjetas[documento] = nueva
        return True

    def recargar(self, documento: str, monto: float) -> bool:
        """
        Recarga el saldo de la tarjeta asociada al documento.
        
        """
        if documento in self.__tarjetas:
            self.__tarjetas[documento].modificar_saldo(monto)
            return True
        else:
            return False

    def consultar(self, documento: str) -> float:
        """
        Consulta el saldo de la tarjeta asociada al documento.
        
        """
        if documento in self.__tarjetas:
            return self.__tarjetas[documento].get_saldo()
        else:
            return 0

    def vender_tiquete(self, documento: str, transporte) -> bool:
        """
        Vende un tiquete de un transporte usando la tarjeta del documento.
        
        """
        if documento in self.__tarjetas:
            tarjeta = self.__tarjetas[documento]
            return transporte.vender_tiquete(tarjeta)
        else:
            return False

    def mostrar_tarjetas(self):
            """
            Muestra todas las tarjetas registradas.
            
            """
            if not self.__tarjetas:
                print("No hay tarjetas registradas.")
            else:
                for doc, tarjeta in self.__tarjetas.items():
                    print(f"Nombre: {tarjeta.get_nombre()} | Saldo: {tarjeta.get_saldo()}")