from decimal import Decimal
import os
from Crud import UsuarioCRUD, TarjetaCRUD
from typing import List
import uuid
from Entities import (
    Usuario, UsuarioCreate, UsuarioUpdate,
    Tarjeta, TarjetaUpdate, TarjetaResponse, TarjetaCreate
)
from database import check_connection, create_tables, get_session

# Variable global para el usuario actual
usuario_actual = None

def limpiar_consola():
    """Limpia la pantalla de la consola"""
    os.system('cls' if os.name == 'nt' else 'clear')

def cerrar_sesion():
    """Cierra la sesión del usuario"""
    #cuando se quiere registrar no funciona
    global usuario_actual
    usuario_actual = None
    menu()

def registrar():
    """Registrar un nuevo usuario con validación de Pydantic"""
    global usuario_actual
    print("\nRegistro de Usuario")
    print("=" * 20)

    while True:
        nombre = input("Nombre: ").strip()
        apellido = input("Apellido: ").strip()
        documento = input("Documento (mínimo 8 caracteres): ").strip()
        email = input("Email: ").strip()

        try:
            # Intentamos crear el objeto Pydantic
            usuario_data = UsuarioCreate(
                nombre=nombre,
                apellido=apellido,
                documento=documento,
                email=email
            )
            usuario = UsuarioCRUD.crear_usuario(usuario_data)
            print(f"Usuario creado: {usuario.nombre} (DOC: {usuario.documento})")
            print("Por favor, inicie sesión.")
            break 

        except ValueError as e:
            print(f"Error en el registro: {e}")
        except Exception as e:
            print(f"Datos inválidos")
            print("Por favor, ingrese los datos nuevamente. Ya existe una cuenta con estos datos\n")


def iniciar_sesion():
    """Inicia sesión de un usuario existente"""
    global usuario_actual
    email = input("Ingrese su email para iniciar sesión: ").strip()
    
    with get_session() as session:
        usuario = UsuarioCRUD.obtener_por_email(session, email)
        if usuario:
            usuario_actual = usuario
            return True
        else:
            print("Usuario no encontrado. Por favor, registrese primero.")
            return False

def conseguir_tarjeta():
    """Permite al usuario conseguir una tarjeta"""
    
    print("\nConseguir Tarjeta")
    print("=" * 20)

    opciones = {
        "1": ("Estudiante", Decimal("0.5")),
        "2": ("Frecuente", Decimal("0.0")),
        "3": ("Adulto_Mayor", Decimal("0.3")),
    }

    while True:
        tipo = input("Tipo de tarjeta (1: Estudiante / 2: Frecuentes / 3: Adulto Mayor): ").strip()
        if tipo in opciones:
            tipo_tarjeta, descuento = opciones[tipo]
            break
        else:
            print("** Opción inválida. Ingrese 1, 2 o 3.\n")

    # Generar número de tarjeta (8 dígitos aleatorios)
    numero_tarjeta = ''.join(filter(str.isdigit, uuid.uuid4().hex))[:8]

    try:
        tarjeta_data = TarjetaCreate(
            id_usuario=usuario_actual.id_usuario,
            tipo_tarjeta=tipo_tarjeta,
            descuento=descuento,
            numero_tarjeta=numero_tarjeta,
            saldo=Decimal("0.00"),
        )

        tarjeta = TarjetaCRUD.crear_tarjeta(tarjeta_data)

        print(f"** Tarjeta creada para {usuario_actual.nombre}")
        print(f"   Número: {tarjeta.numero_tarjeta}")
        print(f"   Tipo: {tarjeta.tipo_tarjeta}")
        print(f"   Saldo inicial: {tarjeta.saldo}")

    except Exception as e:
        print(f"Error al crear tarjeta: {e}")


def menu():
    limpiar_consola()
    """Menú principal del sistema"""
    print("SISTEMA DE TRANSPORTE PÚBLICO")
    print("=" * 60)
    
    if not check_connection():
        print("No se pudo conectar a la base de datos")
        return
    
    try:
        create_tables()
    except Exception as e:
        print(f"Error al crear tablas: {e}")
        return
    
    # Registrar o iniciar sesión
    while True:
        tiene_cuenta = input("¿Tiene cuenta? (s/n): ").strip().lower()
        if tiene_cuenta == 's':
            if iniciar_sesion():
                break
        elif tiene_cuenta == 'n':
            registrar()
        else:
            print("Opción inválida. Ingrese 's' o 'n'.")
    # Menú de usuario logueado
    limpiar_consola()
    while usuario_actual is not None:
        print(f"\n--- BIENVENID@: {usuario_actual.nombre} ---")
        print("1. Conseguir Tarjeta")
        print("2. Recargar tarjeta")
        print("3. Consultar tarjetas") # admin
        print("4. Consultar saldo")
        print("5. Comprar tiquete en Bus")
        print("6. Comprar tiquete en Metro")
        print("7. Comprar tiquete en Tranvía")
        print("8. Cerrar sesión")
        print("9. Salir")

        opcion = input("Seleccione una opción: ").strip()

        if opcion == "1":
            conseguir_tarjeta()
        elif opcion == "2":
            pass 
        elif opcion == "3":
            pass
        elif opcion == "4":
            pass
        elif opcion == "5":
            pass
        elif opcion == "6":
            pass
        elif opcion == "7":
            pass
        elif opcion == "8":
            pass
        elif opcion == "9":
            print("Gracias por usar el sistema de transporte.")
            break
        else:
            print("Opción inválida. Intente de nuevo.")


if __name__ == "__main__":
    menu()
