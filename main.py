from src.Gestor import GestorTarjeta
from src.Transporte import  Tranvia, Bus, Metro

gestor = GestorTarjeta()
tranvia = Tranvia("A", 200, 12)  # Linea, capacidad, paradas
bus = Bus(30, 4, "9:00 - 22:00", "Electrico")  # Linea, capacidad, paradas
metro = Metro("J", 10, "5:00 - 20:00")  # Linea, capacidad, paradas

def menu():
    while True:
        print("\n--- 🚏 Sistema de Transporte Público 🚏 ---")
        print("🔶 1. Conseguir Tarjeta")
        print("🔶 2. Recargar tarjeta")
        print("🔶 3. Consultar tarjetas")
        print("🔶 4. Consultar saldo")
        print("🔶 5. Comprar tiquete en Bus")
        print("🔶 6. Comprar tiquete en Metro")
        print("🔶 7. Comprar tiquete en Tranvía")
        print("🔶 8. Salir")

        opcion = input("Seleccione una opción: ").strip()

        if opcion == "1":# Opción para crear una nueva tarjeta
            nombre = input("Ingrese su nombre: ").strip()
            documento = input("Ingrese su documento: ").strip()
            
            # Validación de datos
            if nombre.isalpha() == False or documento.isdigit() == False:#validacion de datos validos
                print("❌ Nombre o documento inválido.")
                continue
            if gestor.crear_tarjeta(nombre, documento):
                print(f"✅ Tarjeta creada para {nombre}")
            else:
                print("❌ Ya existe una tarjeta registrada para este documento")

        elif opcion == "2": # Opción para recargar una tarjeta existente
            documento = input("Ingrese su documento: ").strip()
            monto_str = input("Ingrese el monto a recargar: ").strip()
            
            if monto_str.isdigit(): # Validar que el monto sea un número entero positivo
                monto = int(monto_str)
                if monto > 0:
                    if gestor.recargar(documento, monto):
                        saldo = gestor.consultar(documento)
                        print(f"✅ Recarga exitosa, nuevo saldo: {saldo}")
                    else:
                        print("❌ No hay ninguna tarjeta asociada a ese documento")
                else:
                    print("❌ Monto inválido para recarga.")
            else:
                print("❌ Debe ingresar solo números enteros.")

        elif opcion == "3": # Opción para consultar todas las tarjetas registradas
            if gestor.get_targetas() == {}:
                print("❌ No hay tarjetas registradas.")
                continue
            else:
                print("💳 Tarjetas registradas: 💳")
                for doc, tarjeta in gestor.get_targetas().items():
                    print(f"Nombre: {tarjeta.get_nombre()} \nDocumento: {doc} \nSaldo: {tarjeta.get_saldo()} \n -------")
        
        elif opcion == "4": # Opción para consultar el saldo de una tarjeta
            documento = input("Ingrese su documento: ").strip()
            saldo = gestor.consultar(documento)
            if saldo == 0:
                print("❌ No hay saldo asociado a este documento.")
            else:
                print(f"💳 Su saldo es: {saldo}")

        elif opcion == "5":# Comprar tiquete para Bus
            documento = input("Ingrese su documento: ").strip()
            if gestor.vender_tiquete(documento, bus):
                print("🎟️  Tiquete de Bus comprado con éxito.")
                print("ℹ️  ", bus.info())
            else:
                print("❌ No se pudo comprar: saldo insuficiente o tarjeta inexistente.")

        elif opcion == "6": # Comprar tiquete para Metro
            documento = input("Ingrese su documento: ").strip()
            if gestor.vender_tiquete(documento, metro):
                print("🎟️   Tiquete de Metro comprado con éxito.")
                print("ℹ️  ", metro.info())
            else:
                print("❌ No se pudo comprar: saldo insuficiente o tarjeta inexistente.")

        elif opcion == "7":# Comprar tiquete para Tranvía
            documento = input("Ingrese su documento: ").strip()
            if gestor.vender_tiquete(documento, tranvia):
                print("🎟️   Tiquete de Tranvía comprado con éxito.")
                print("ℹ️  ", tranvia.info())
            else:
                print("❌ No se pudo comprar: saldo insuficiente o tarjeta inexistente.")

        elif opcion == "8": # Salir del sistema
            print("👋 Gracias por usar el sistema de transporte.")
            break
        else:
            print("❌ Opción inválida. Intente de nuevo.")


if __name__ == "__main__":
    menu()