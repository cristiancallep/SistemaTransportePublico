from database import get_db, create_tables
import os
from Crud import UsuarioCRUD, AuditoriaCRUD
from Entities import (
    Usuario,
    UsuarioCreate,
    UsuarioUpdate,
)
from Entities.tarjeta import Tarjeta
import logica

# from seeders import run_rol_usuario_seeders PARA EJECUTAR LOS SEEDERS SOLO LA PRIMERA VEZ

usuario_actual = None


def limpiar_consola():
    """Limpia la pantalla de la consola"""
    os.system("cls" if os.name == "nt" else "clear")


def agregar_auditoria_usuario(nombre_accion: str, nombre_tabla: str, usuario: Usuario):
    """
    Método para agregar un registro a la tabla auditoria
    """
    db_gen = get_db()
    db = next(db_gen)
    try:
        auditoria_crud = AuditoriaCRUD(db)

        usuario_id = usuario_actual.id_usuario if usuario_actual else usuario.id_usuario

        auditoria_crud.registrar_evento(
            usuario_id=usuario_id,
            tabla_afectada=nombre_tabla,
            accion=nombre_accion,
            descripcion=(
                f"{nombre_accion} del usuario: {usuario.nombre} {usuario.apellido} "
                f"| correo: {usuario.email} | documento: {usuario.documento}"
            ),
        )
        db.commit()
    except Exception as e:
        print(f"Error al registrar auditoría: {e}")
        db.rollback()
    finally:
        db_gen.close()


def registrar(es_admin=False):
    """
    Registra un nuevo usuario. Si es_admin es True, permite seleccionar el rol.
    """
    print("\n=== REGISTRO DE USUARIO ===")

    nombre = input("Nombre: ").strip()
    apellido = input("Apellido: ").strip()
    documento = input("Documento (mínimo 8 caracteres): ").strip()
    email = input("Email: ").strip()
    contrasena = input("Contraseña: ").strip()

    if es_admin:
        print("\nRoles disponibles:")
        print("1. Administrador")
        print("2. Cliente")
        id_rol = input("Seleccione el rol: ").strip()
        if id_rol != "1" and id_rol != "2":
            print("Rol inválido. Debe ser 1 o 2.")
            menuAdmin()
        int(id_rol)
    else:
        id_rol = 2

    db_gen = get_db()
    db = next(db_gen)

    try:
        usuario_crud = UsuarioCRUD(db)
        nuevo_usuario = usuario_crud.crear_usuario(
            UsuarioCreate(
                nombre=nombre,
                apellido=apellido,
                documento=documento,
                email=email,
                contrasena=contrasena,
                id_rol=id_rol,
            )
        )

        print(
            f"\nUsuario '{nuevo_usuario.nombre} {nuevo_usuario.apellido}' registrado con éxito."
        )
        print("Ahora puede iniciar sesión con sus credenciales.")
        agregar_auditoria_usuario(
            nombre_accion="CREATE", nombre_tabla="usuarios", usuario=nuevo_usuario
        )

    except ValueError as e:
        print(f"\nError: {e}")
        db.rollback()

    except Exception as e:
        print(f"\nError inesperado: {e}")
        db.rollback()

    finally:
        db_gen.close()


def iniciar_sesion():
    """
    Iniciar sesión de usuario con validación usando get_db y UsuarioCRUD
    Returns: True si el inicio de sesión es exitoso, False en caso contrario.

    """
    global usuario_actual
    print("\nIniciar Sesión")
    print("=" * 20)

    email = input("Ingrese su email: ").strip()
    contrasena = input("Ingrese su contraseña: ").strip()

    db_gen = get_db()
    db = next(db_gen)
    try:
        usuario_crud = UsuarioCRUD(db)
        usuario = usuario_crud.validar_credenciales(email, contrasena)

        usuario_actual = usuario

        if usuario.id_rol == 1:
            menuAdmin()
        else:
            menuUsuario()

        return True
    except ValueError as e:
        print(f"Error: {e}")
        return False
    finally:
        db_gen.close()


def menuUsuario():
    """
    Menú principal del sistema de transporte público para usuarios registrados

    """
    print("SISTEMA DE TRANSPORTE PÚBLICO")
    print("=" * 60)
    limpiar_consola()

    while usuario_actual is not None:
        print(f"\n¡Bienvenido Cliente {usuario_actual.nombre}!")
        print("9. salir")

        opcion = input(
            "Seleccione una opción:\n"
            "1. Crear Tarjeta\n"
            "2. Recargar Tarjeta\n"
            "3. Consultar Saldo\n"
        ).strip()

        if opcion == "1":  # maicol2314
            documento = input("Ingrese su documento: ").strip()
            logica.crear_tarjeta(documento=documento)

        elif opcion == "2":
            documento = input("Ingrese su documento: ").strip()
            monto = float(input("Ingrese el monto a recargar: ").strip())
            logica.recargar_tarjeta(documento=documento, monto=monto)
        elif opcion == "3":
            documento = input("Ingrese su documento: ").strip()
            logica.consultar_saldo(documento=documento)
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
            print(f"{usuario_actual.nombre} Gracias por usar el sistema de transporte.")
            break
        else:
            print("Opción inválida. Intente de nuevo.")


def menuAdmin():
    limpiar_consola()
    while usuario_actual is not None:
        print(f"\n--- BIENVENID@ ADMIN: {usuario_actual.nombre} ---")
        print("1. Registrar Usuarios")
        print("2. Actualizar Usuarios")
        print("3. Eliminar Usuarios")
        print("4. Consultar Usuarios")
        print("5. Ver cambios")
        print("6. Agregar Ruta")
        print("7. Modificar Ruta")
        print("8. Salir")

        opcion = input("Seleccione una opción: ").strip()

        if opcion == "1":
            registrar(es_admin=True)
        elif opcion == "2":
            actualizar_usuario_admin()
        elif opcion == "3":
            eliminar_usuario_admin()
        elif opcion == "4":
            admin_listar_usuarios()
        elif opcion == "5":
            admin_listar_cambios()
        elif opcion == "6":
            nombre_ruta = input("Ingrese el nombre de la nueva ruta: ").strip()
            origen = input("Ingrese el origen de la ruta: ").strip()
            destino = input("Ingrese el destino de la ruta: ").strip()
            duracion = float(
                input("Ingrese la duración estimada (en minutos): ").strip()
            )
            logica.generar_ruta(nombre_ruta, origen, destino, duracion)
        elif opcion == "7":
            nombre_ruta = input("Ingrese el nombre de la nueva ruta: ").strip()
            origen = input("Ingrese el origen de la ruta: ").strip()
            destino = input("Ingrese el destino de la ruta: ").strip()
            duracion = float(
                input("Ingrese la duración estimada (en minutos): ").strip()
            )
            logica.modificar_ruta(nombre_ruta, origen, destino, duracion)
        elif opcion == "8":
            print(f"{usuario_actual.nombre} Gracias por usar el sistema de transporte.")
            break


def admin_listar_usuarios():
    """Muestra todos los usuarios en la base de datos"""
    db_gen = get_db()
    db = next(db_gen)
    try:
        usuario_crud = UsuarioCRUD(db)
        usuarios = usuario_crud.listar_usuarios()

        print("\n=== LISTA DE USUARIOS ===")
        for u in usuarios:
            print(
                f"Nombre: {u.nombre} {u.apellido} | Email: {u.email} | Rol: {u.id_rol} | Documento: {u.documento} | fecha creacion: {u.fecha_registro} | fecha actualizacion: {u.fecha_actualizar}\n"
            )

        if not usuarios:
            print("No hay usuarios registrados.")

    finally:
        db_gen.close()


def admin_listar_cambios():
    """
    Método para que el admin vea los cambios realizados en el sistema
    """
    db_gen = get_db()
    db = next(db_gen)
    try:
        auditoria_crud = AuditoriaCRUD(db)
        cambios_all = auditoria_crud.obtener_todas()
        cambios_actual = auditoria_crud.obtener_por_usuario(usuario_actual.id_usuario)

        print("\n=== MIS CAMBIOS ===")
        if cambios_actual:
            for cambio in cambios_actual:
                print(
                    f"[{cambio.fecha}] {cambio.accion} en {cambio.tabla_afectada} | "
                    f"Detalle: {cambio.descripcion}\n"
                )
        else:
            print("No has realizado cambios aún.")

        print("\n=== TODOS LOS CAMBIOS ===")
        if cambios_all:
            for cambio in cambios_all:
                print(
                    f"[{cambio.fecha}] Usuario ID: {cambio.id_usuario} "
                    f"| {cambio.accion} en {cambio.tabla_afectada} | "
                    f"Detalle: {cambio.descripcion}\n"
                )
        else:
            print("No hay cambios registrados aún.")

    finally:
        db_gen.close()


def actualizar_usuario_admin():
    """
    Metodo para que el admin actualice los datos de un usuario existente
    - Busca el usuario por email y documento para mayor seguridad
    """
    db_gen = get_db()
    db = next(db_gen)
    print("\n=== ACTUALIZAR USUARIO ===")

    email = input("Ingrese el email del usuario: ").strip().lower()
    documento = input("Ingrese el documento del usuario: ").strip()

    if not email or not documento:
        print("Debe ingresar ambos datos: email y documento.")
        return

    try:
        usuario_crud = UsuarioCRUD(db)
        usuario = usuario_crud.obtener_por_email(email)

        if not usuario or usuario.documento != documento:
            print("No se encontró un usuario con ese email y documento.")
            return

        print(
            f"===\nUsuario encontrado: {usuario.nombre} {usuario.apellido}\n Rol actual: {usuario.id_rol} \n==="
        )

        print("\nDeje el campo vacío si no desea modificarlo.")

        nombre = input("Nuevo nombre: ").strip()
        apellido = input("Nuevo apellido: ").strip()
        nuevo_email = input("Nuevo email: ").strip()

        print("\nRoles disponibles:")
        print("1. Administrador")
        print("2. Cliente")
        id_rol = input("Nuevo rol (1-2): ").strip()

        if id_rol != "1" and id_rol != "2" and id_rol != "":
            print("Rol inválido. Debe ser 1 o 2.")
            return
        id_rol = int(id_rol) if id_rol else None

        usuario_update = UsuarioUpdate(
            nombre=nombre if nombre else None,
            apellido=apellido if apellido else None,
            email=nuevo_email if nuevo_email else None,
            id_rol=id_rol,
        )

        usuario_actualizado = usuario_crud.actualizar_usuario(
            usuario.id_usuario, usuario_update
        )

        print("\nUsuario actualizado con éxito. Datos finales:")
        datos = usuario_crud.mostrar_usuario(usuario_actualizado.id_usuario)
        for clave, valor in datos.items():
            print(f"{clave}: {valor}")

        agregar_auditoria_usuario(
            nombre_accion="UPDATE", nombre_tabla="usuarios", usuario=usuario
        )

    except ValueError as e:
        print(f"\nError: {e}")
        db.rollback()

    except Exception as e:
        print(f"\nError inesperado: {e}")
        db.rollback()

    finally:
        db_gen.close()


def eliminar_usuario_admin():
    """
    metodo para que el admin elimine un usuario existente

    """
    print("\n=== ELIMINAR USUARIO ===")

    email = input("Ingrese el email del usuario: ").strip().lower()
    documento = input("Ingrese el documento del usuario: ").strip()

    if not email or not documento:
        print("Debe ingresar ambos datos: email y documento.")
        return

    db_gen = get_db()
    db = next(db_gen)

    try:
        usuario_crud = UsuarioCRUD(db)

        usuario = usuario_crud.obtener_por_email(email)

        if not usuario or usuario.documento != documento:
            print("No se encontró un usuario con ese email y documento.")
            return

        print(
            f"\nUsuario encontrado: {usuario.nombre} {usuario.apellido}\nRol: {usuario.id_rol})"
        )

        confirmar = (
            input("¿Está seguro de que desea eliminar este usuario? (s/n): ")
            .strip()
            .lower()
        )
        if confirmar != "s":
            print("Operación cancelada.")
            return

        usuario_crud.eliminar_usuario(usuario.id_usuario)

        print(
            f"\nUsuario '{usuario.nombre} {usuario.apellido}' eliminado correctamente."
        )
        agregar_auditoria_usuario(
            nombre_accion="DELETE", nombre_tabla="usuarios", usuario=usuario
        )

    except ValueError as e:
        print(f"\nError: {e}")
        db.rollback()

    except Exception as e:
        print(f"\nError inesperado: {e}")
        db.rollback()

    finally:
        db_gen.close()


def inicio():
    while True:
        tiene_cuenta = input("¿Tiene cuenta? (s/n): ").strip().lower()
        if tiene_cuenta == "s":
            if iniciar_sesion():
                break
        elif tiene_cuenta == "n":
            registrar()
        else:
            print("Opción inválida. Ingrese 's' o 'n'.")


if __name__ == "__main__":
    print("Creando tablas en la base de datos...")
    # try: PARA CREAR LAS TABLAS Y LOS SEEDERS SOLO LA PRIMERA VEZ
    #     create_tables()
    #     print("Tablas creadas exitosamente.")
    #     print("Iniciando seeders de roles y usuarios...")
    #     run_rol_usuario_seeders()
    #     print("Seeders ejecutados con éxito.")
    # except Exception as e:
    #     print(f"Error al crear tablas o ejecutar seeders: {e}")
    inicio()
