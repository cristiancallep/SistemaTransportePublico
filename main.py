from src.Gestor import GestorTarjeta
from src.Transporte import Transporte
from src.Tranvia import  Tranvia
from src.Bus import  Bus
from src.Metro import Metro

gestor = GestorTarjeta()
tranvia = Tranvia("A", 200, 12) 
bus = Bus(30, 4, "9:00 - 22:00", "Electrico")  
metro = Metro("J", 10, "5:00 - 20:00")  

def menu():
    """
    Función principal que muestra el menú y maneja las opciones del usuario.
    Permite crear tarjetas, recargar saldo, consultar tarjetas y comprar tiquetes para diferentes medios de transporte.
    Args:
        None    
    Returns:
        None
        
    """
    while True:
        print("\n--- Sistema de Transporte Público  ---")
        print("1. Conseguir Tarjeta")
        print("2. Recargar tarjeta")
        print("3. Consultar tarjetas")
        print("4. Consultar saldo")
        print("5. Comprar tiquete en Bus")
        print("6. Comprar tiquete en Metro")
        print("7. Comprar tiquete en Tranvía")
        print("8. Salir")

        opcion = input("Seleccione una opción: ").strip()

        if opcion == "1":
            nombre = input("Ingrese su nombre: ").strip()
            documento = input("Ingrese su documento: ").strip()
            
            if nombre.isalpha() == False or documento.isdigit() == False:
                print("Nombre o documento inválido.")
                continue
            if gestor.crear_tarjeta(nombre, documento):
                print(f"Tarjeta creada para {nombre}")
            else:
                print("Ya existe una tarjeta registrada para este documento")

        elif opcion == "2":
            documento = input("Ingrese su documento: ").strip()
            monto_str = input("Ingrese el monto a recargar: ").strip()
            
            if monto_str.isdigit():
                monto = int(monto_str)
                if monto > 0:
                    if gestor.recargar(documento, monto):
                        saldo = gestor.consultar(documento)
                        print(f"Recarga exitosa, nuevo saldo: {saldo}")
                    else:
                        print("No hay ninguna tarjeta asociada a ese documento")
                else:
                    print("Monto inválido para recarga.")
            else:
                print("Debe ingresar solo números enteros.")

        elif opcion == "3":
            gestor.mostrar_tarjetas()
            
        elif opcion == "4":
            documento = input("Ingrese su documento: ").strip()
            saldo = gestor.consultar(documento)
            if saldo == 0:
                print("No hay saldo asociado a este documento.")
            else:
                print(f"Su saldo es: {saldo}")

        elif opcion == "5":
            documento = input("Ingrese su documento: ").strip()
            if gestor.vender_tiquete(documento, bus):
                print("Tiquete de Bus comprado con éxito.")
                print("*", bus.info())
            else:
                print(" No se pudo comprar: saldo insuficiente o tarjeta inexistente.")

        elif opcion == "6":
            documento = input("Ingrese su documento: ").strip()
            if gestor.vender_tiquete(documento, metro):
                print("Tiquete de Metro comprado con éxito.")
                print("*", metro.info())
            else:
                print("No se pudo comprar: saldo insuficiente o tarjeta inexistente.")

        elif opcion == "7":
            documento = input("Ingrese su documento: ").strip()
            if gestor.vender_tiquete(documento, tranvia):
                print("Tiquete de Tranvía comprado con éxito.")
                print("*", tranvia.info())
            else:
                print("No se pudo comprar: saldo insuficiente o tarjeta inexistente.")

        elif opcion == "8":
            print("Gracias por usar el sistema de transporte.")
            break
        else:
            print("Opción inválida. Intente de nuevo.")


if __name__ == "__main__":
    menu()