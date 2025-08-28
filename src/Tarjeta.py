class Tarjeta:
    def __init__(self,nombre:str,documento:str):
        self.nombre=nombre
        self.__documento=documento    
        self.__saldo=0  #saldo inicial siempre 0 
        
    def set_saldo(self,monto:float)->None:
        self.__saldo+=monto
    def get_saldo(self)->float:
        return self.__saldo
    def pagar(self,valor:float)->float:
        pass
    