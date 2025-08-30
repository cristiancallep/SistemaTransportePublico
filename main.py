from src.Gestor import GestorTarjeta
from src.Transporte import  Tranvia

gestor = GestorTarjeta()
tranvia = Tranvia("A", 200, 12)  # Linea, capacidad, paradas


def menu():
    while True:
        print("\n---  Sistema de Transporte Público ---")
        print("1. Conseguir Tarjeta")
        print("2. Recargar tarjeta")
        print("3. Consultar saldo")
        print("4. Comprar tiquete en Bus")
        print("5. Comprar tiquete en Metro")
        print("6. Comprar tiquete en Tranvía")
        print("7. Salir")

        opcion = input("Seleccione una opción: ").strip()

        if opcion == "1":
            nombre = input("Ingrese su nombre: ").strip()
            documento = input("Ingrese su documento: ").strip()
            if gestor.crear_tarjeta(nombre, documento):
                print(f"✅ Tarjeta creada para {nombre}")
            else:
                print("❌ Ya existe una tarjeta registrada para este documento")

        elif opcion == "2":
            documento = input("Ingrese su documento: ").strip()
            monto_str = input("Ingrese el monto a recargar: ").strip()
            if monto_str.isdigit():
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

        elif opcion == "3":
            documento = input("Ingrese su documento: ").strip()
            saldo = gestor.consultar(documento)
            if saldo == 0:
                print("❌ No hay saldo asociado a este documento.")
            else:
                print(f"💳 Su saldo es: {saldo}")

        elif opcion == "4":
            pass

        elif opcion == "5":
            pass

        elif opcion == "6":
            documento = input("Ingrese su documento: ").strip()
            if gestor.vender_tiquete(documento, tranvia):
                print("🎟️ Tiquete de Tranvía comprado con éxito.")
                print("ℹ️", tranvia.info())
            else:
                print("❌ No se pudo comprar: saldo insuficiente o tarjeta inexistente.")

        elif opcion == "7":
            print("👋 Gracias por usar el sistema de transporte.")
            break
        else:
            print("❌ Opción inválida. Intente de nuevo.")


if __name__ == "__main__":
    menu()