from src.Tarjeta import Tarjeta

class GestorTarjeta:
    def __init__(self):
        self.tarjetas = {}
    
    def crear_tarjeta(self,nombre:str,documento:str)->bool:
        if documento in self.tarjetas:
            return False
        nueva=Tarjeta(nombre,documento)
        self.tarjetas[documento] = nueva
        return True
    
    def recargar(self,documento:str,monto:float):
        if documento in self.tarjetas:
            self.tarjetas[documento].set_saldo(monto)
            return True, self.tarjetas[documento].get_saldo()
        else:
            return False,0
        
    def consultar(self,documento:str)->float:
        if documento in self.tarjetas:
            return self.tarjetas[documento].get_saldo()
        else:
            return 0
