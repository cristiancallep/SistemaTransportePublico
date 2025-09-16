from psycopg2 import IntegrityError
from database import get_db, create_tables
import bcrypt
import os
from Crud import UsuarioCRUD
from Entities import (
    Usuario, UsuarioCreate, UsuarioUpdate,
    Rol, RolCreate, RolUpdate,
    Auditoria, AuditoriaBase, AuditoriaCreate
)
from database import SessionLocal
from seeders import run_rol_usuario_seeders

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
    iniciar_sesion()
        

def registrar():
    """Registrar un nuevo usuario con validación y contraseña segura usando get_db y UsuarioCRUD"""
    global usuario_actual
    print("\nRegistro de Usuario")
    print("=" * 20)

    while True:
        # === 1. Captura de datos ===
        nombre = input("Nombre: ").strip()
        apellido = input("Apellido: ").strip()
        documento = input("Documento (mínimo 8 caracteres): ").strip()
        email = input("Email: ").strip()
        contrasena = input("Contraseña: ").strip()

        # Validación de longitud de contraseña
        if len(contrasena) < 6:
            print("La contraseña debe tener al menos 6 caracteres.\n")
            continue

        try:
            hash_contrasena = bcrypt.hashpw(contrasena.encode('utf-8'),bcrypt.gensalt()).decode('utf-8')

            usuario_data = UsuarioCreate(
                nombre=nombre,
                apellido=apellido,
                documento=documento,
                email=email,
                contrasena=hash_contrasena
            )
            db_gen = get_db()
            db = next(db_gen)

            try:
                usuario_crud = UsuarioCRUD(db)
                usuario = usuario_crud.crear_usuario(usuario_data)

                print(f"\n Usuario creado exitosamente: {usuario.nombre} (DOC: {usuario.documento})")
                print("Ahora puede iniciar sesión.\n")
                break

            except ValueError as e:
                db.rollback()
                print(f"Error en el registro: {e}\n")

            except IntegrityError:
                db.rollback()
                print("Ya existe un usuario con ese email o documento. Verifique los datos.\n")

            finally:
                db_gen.close()  # Cerrar la sesión correctamente

        except Exception as e:
            print("Datos inválidos o error inesperado. Intente nuevamente.\n")
            print(f"Error inesperado: {e}\n")

def iniciar_sesion():
    """Inicia sesión de un usuario existente verificando la contraseña y rol"""
    global usuario_actual
    print("\nIniciar Sesión")
    print("=" * 20)

    email = input("Ingrese su email: ").strip()

    db_gen = get_db()
    db = next(db_gen)
    try:
        usuario_crud = UsuarioCRUD(db)
        usuario = usuario_crud.obtener_por_email(email)

        if not usuario:
            print("Usuario no encontrado. Por favor, regístrese primero.")
            return False

        if not getattr(usuario, "contrasena", None):
            print("El usuario no tiene contraseña registrada. Contacte al administrador.")
            return False

        # Pedir contraseña hasta que sea correcta
        while True:
            contrasena = input("Ingrese su contraseña: ").strip()

            try:
                if bcrypt.checkpw(contrasena.encode("utf-8"), usuario.contrasena.encode("utf-8")):
                    usuario_actual = usuario  # Guardar el usuario que inició sesión

                    # Verificar rol y llamar al menú correspondiente (si existe)
                    rol = getattr(usuario, "id_rol", None)
                    if rol == 1:
                        try:
                            menuAdmin()
                        except NameError:
                            print(f"\n¡Bienvenido Administrador {usuario.nombre}!")
                    elif rol == 2:
                        try:
                            menuUsuario()
                        except NameError:
                            print(f"\n¡Bienvenido Cliente {usuario.nombre}!")
                    else:
                        print(f"\n¡Bienvenido {usuario.nombre}! (Rol: {rol})")

                    return True
                else:
                    print("Contraseña incorrecta. Intente nuevamente.\n")
            except Exception as e:
                print(f"Error al verificar la contraseña: {e}")
                return False
    finally:
        # Cerrar el generador para que se ejecute su finally() y se cierre la sesión
        db_gen.close()



        
def menuUsuario():
    """Menú principal del sistema"""
    print("SISTEMA DE TRANSPORTE PÚBLICO")
    print("=" * 60)
    
    try:
        create_tables()
    except Exception as e:
        print(f"Error al crear tablas: {e}")
        return
    limpiar_consola()
    # Menú de usuario logueado
    while usuario_actual is not None:
        print(f"\n¡Bienvenido Cliente {usuario_actual.nombre}!")
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

def menuAdmin():
    while usuario_actual is not None:
        print(f"\n--- BIENVENID@ ADMIN: {usuario_actual.nombre} ---")
        print("1. Registrar Usuarios")
        print("2. Consultar Usuarios")
        print("3. Consultar Tarjetas")
        print("4. Ver cambios")
        break

def inicio():
    print("Creando tablas en la base de datos...")
    create_tables()
    run_rol_usuario_seeders()
    while True:
        tiene_cuenta = input("¿Tiene cuenta? (s/n): ").strip().lower()
        if tiene_cuenta == 's':
            if iniciar_sesion():
                break
        elif tiene_cuenta == 'n':
            registrar()
        else:
            print("Opción inválida. Ingrese 's' o 'n'.")
            

if __name__ == "__main__":
    inicio()
