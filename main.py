# Programa principal con menú
from src.Gestor import GestorTarjeta
gestor = GestorTarjeta()

def menu():

    
    while True:
        print("\n---  Sistema de Transporte Público ---")
        print("1. Conseguir Tarjeta")    ##Las personas no inician con tarjeta.
        print("2. Recargar tarjeta")
        print("3. Consultar saldo")
        print("4. Comprar tiquete en Bus")
        print("5. Comprar tiquete en Metro")
        print("6. Comprar tiquete en Tranvía")
        print("7. Salir")

        opcion = input("Seleccione una opción: ").strip()

        if opcion == "1":
            nombre=str(input("Ingrese su nombre: "))
            documento = str(input("Ingrese su documento: "))
            
            if gestor.crear_tarjeta(nombre,documento):
                print(f"Tarjeta creada para {nombre}")
            else:
                print("Ya existe una tarjeta registrada para este documento")
            

        elif opcion == "2":
            documento = str(input("Ingrese su documento: "))
            monto = float(input("Ingrese el monto a recargar: "))

            ok,saldo = gestor.recargar(documento,monto)

            if ok: 
                print(f"recarga exitosa, nuevo saldo: {saldo}")
            else:
                print("No hay ninguna tarjeta asociada a es documento")
            
        elif opcion == "3":
            documento = str(input("Ingrese su documento: "))
            saldo = gestor.consultar(documento)
            if saldo ==0:
                print("No hay una tarjeta asociada a este documento.")
            else:
                print(f"Su saldo es: {saldo}")
            
            
        elif opcion == "4":
            pass        
        elif opcion == "5":
            pass

        elif opcion == "6":
            
            pass
        elif opcion=="7":
            print(" Gracias por usar el sistema de transporte.")
            break

        else:
            print(" Opción inválida. Intente de nuevo.")


if __name__ == "__main__":
    menu()