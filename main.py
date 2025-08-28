# Programa principal con menú
def menu():

    while True:
        print("\n---  Sistema de Transporte Público ---")
        print("1. Recargar tarjeta")
        print("2. Consultar saldo")
        print("3. Comprar tiquete en Bus")
        print("4. Comprar tiquete en Metro")
        print("5. Comprar tiquete en Tranvía")
        print("6. Salir")

        opcion = input("Seleccione una opción: ").strip()

        if opcion == "1":
            pass

        elif opcion == "2":
            pass

        elif opcion == "3":
            pass
            
        elif opcion == "4":
            pass
           
        elif opcion == "5":
            pass

        elif opcion == "6":
            print(" Gracias por usar el sistema de transporte.")
            break

        else:
            print(" Opción inválida. Intente de nuevo.")


if __name__ == "__main__":
    menu()