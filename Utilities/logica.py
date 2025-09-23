import os
import random
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    select,
)
from sqlalchemy.orm import Session
from database import get_db, create_tables
from Entities import usuario, Usuario, UsuarioCreate, UsuarioUpdate
from Crud import UsuarioCRUD, AuditoriaCRUD
from Crud.ruta_crud import RutaCRUD
from Crud.tarjeta_crud import TarjetaCRUD
from Crud.transacciones_crud import TransaccionCRUD
from Crud.linea_crud import LineaCRUD

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
                f"{nombre_accion} en {nombre_tabla}: {usuario.nombre} {usuario.apellido} "
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
            return
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
        # Auditoría solo si el commit fue exitoso
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
        return usuario
    except ValueError as e:
        print(f"Error: {e}")
        return None
    finally:
        db_gen.close()


def admin_listar_usuarios():
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
    db_gen = get_db()
    db = next(db_gen)
    print("\n=== ACTUALIZAR USUARIO ===")
    email = input("Ingrese el email del usuario: ").strip().lower()
    documento = input("Ingrese el documento del usuario: ").strip()
    if not email or not documento:
        print("Debe ingresar ambos datos: email y documento.")
        db_gen.close()
        return
    try:
        usuario_crud = UsuarioCRUD(db)
        usuario = usuario_crud.obtener_por_email(email)
        if usuario is None or usuario.documento != documento:
            print("No se encontró un usuario con ese email y documento.")
            db_gen.close()
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
            db_gen.close()
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
        db_gen.close()
    except ValueError as e:
        print(f"\nError: {e}")
        db.rollback()
        db_gen.close()
    except Exception as e:
        print(f"\nError inesperado: {e}")
        db.rollback()
        db_gen.close()


def eliminar_usuario_admin():
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


def crear_tarjeta(
    documento: str, tipo_tarjeta="Frecuentes", estado="Activa", saldo=0.0
) -> None:
    create_tables()
    db_gen = get_db()
    db = next(db_gen)
    numero = generar_numero_tarjeta()
    try:
        tarjeta_crud = TarjetaCRUD(db)
        id_usuario_obj = db.execute(
            select(usuario.Usuario).where(usuario.Usuario.documento == documento)
        ).scalar_one_or_none()

        if not id_usuario_obj:
            print(f"No se encontró un usuario con el documento: {documento}")
            return
        id_usuario = id_usuario_obj.id_usuario

        # Verificar si ya existe una tarjeta para este usuario
        from Entities.tarjeta import Tarjeta

        tarjeta_existente = db.query(Tarjeta).filter_by(id_usuario=id_usuario).first()
        if tarjeta_existente:
            print("El usuario ya tiene una tarjeta registrada. No se puede crear otra.")
            return

        tarjeta_crud.registrar_tarjeta(id_usuario, tipo_tarjeta, estado, numero, saldo)
        db.commit()
        print(f"Tarjeta creada exitosamente con número: {numero}")
        # Auditoría solo si el commit fue exitoso
        usuario_obj = db.query(Usuario).filter_by(id_usuario=id_usuario).first()
        if usuario_obj:
            agregar_auditoria_usuario("CREATE", "tarjetas", usuario_obj)
    except Exception as e:
        print(f"Error al registrar auditoría: {e}")
        db.rollback()
    finally:
        db_gen.close()


def recargar_tarjeta(documento: str, monto: float) -> None:
    create_tables()
    db_gen = get_db()
    db = next(db_gen)
    try:
        tarjeta_crud = TarjetaCRUD(db)
        transaccion_crud = TransaccionCRUD(db)
        id_usuario = db.execute(
            select(usuario.Usuario).where(usuario.Usuario.documento == documento)
        ).scalar_one_or_none()

        if not id_usuario:
            print(f"No se encontró un usuario con el documento: {documento}")
            return
        numero_tarjeta = tarjeta_crud.obtener_numero_tarjeta(id_usuario.id_usuario)
        transaccion_crud.registrar_transaccion(numero_tarjeta, "Recarga", monto)

        tarjeta_crud.recargar_tarjeta(documento, monto)
        db.commit()
        print(f"Tarjeta recargada exitosamente con monto: {monto}")
        # Auditoría solo si el commit fue exitoso
        id_usuario_obj = db.execute(
            select(usuario.Usuario).where(usuario.Usuario.documento == documento)
        ).scalar_one_or_none()
        if id_usuario_obj:
            agregar_auditoria_usuario("UPDATE", "tarjetas", id_usuario_obj)
    except Exception as e:
        print(f"Error al registrar auditoría: {e}")
        db.rollback()
    finally:
        db_gen.close()


def consultar_saldo(documento: str) -> None:
    create_tables()
    db_gen = get_db()
    db = next(db_gen)
    try:
        tarjeta_crud = TarjetaCRUD(db)
        saldo = tarjeta_crud.obtener_saldo(documento)
        transaccion_crud = TransaccionCRUD(db)
        if saldo is not None:
            id_usuario = db.execute(
                select(usuario.Usuario).where(usuario.Usuario.documento == documento)
            ).scalar_one_or_none()
            numero_tarjeta = tarjeta_crud.obtener_numero_tarjeta(id_usuario.id_usuario)
            transaccion_crud.registrar_transaccion(numero_tarjeta, "Consulta", 0.0)
            db.commit()
            print(f"El saldo de la tarjeta es: {saldo}")
            # Auditoría solo si la consulta fue exitosa
            if id_usuario:
                agregar_auditoria_usuario("CONSULT", "tarjetas", id_usuario)

        else:
            print(
                "No se encontró la tarjeta para el usuario con el documento proporcionado."
            )
    except Exception as e:
        print(f"Error al consultar el saldo: {e}")
    finally:
        db_gen.close()


def generar_ruta(
    nombre_ruta: str, origen: str, destino: str, duracion: float, id_linea=None
) -> None:
    create_tables()
    db_gen = get_db()
    db = next(db_gen)
    try:
        ruta_crud = RutaCRUD(db)
        ruta_crud.registrar_ruta(
            nombre_ruta, origen, destino, duracion, id_linea=id_linea
        )
        db.commit()
        print(f"Ruta {nombre_ruta} creada exitosamente.")
        # Auditoría solo si el commit fue exitoso
        if usuario_actual:
            agregar_auditoria_usuario("CREATE", "rutas", usuario_actual)
    except Exception as e:
        print(f"Error al registrar la ruta: {e}")
        db.rollback()
    finally:
        db_gen.close()


def modificar_ruta(
    id_ruta: int, nombre_ruta: str, origen: str, destino: str, duracion: float
) -> None:
    create_tables()
    db_gen = get_db()
    db = next(db_gen)
    try:
        ruta_crud = RutaCRUD(db)
        ruta_crud.modificar_ruta(id_ruta, nombre_ruta, origen, destino, duracion)
        db.commit()
        print(f"Ruta {nombre_ruta} modificada exitosamente.")
        # Auditoría solo si el commit fue exitoso
        if usuario_actual:
            agregar_auditoria_usuario("UPDATE", "rutas", usuario_actual)
    except Exception as e:
        print(f"Error al modificar la ruta: {e}")
        db.rollback()
    finally:
        db_gen.close()


def generar_linea(nombre: str, descripcion: str) -> None:
    create_tables()
    db_gen = get_db()
    db = next(db_gen)
    try:
        linea_crud = LineaCRUD(db)
        linea_crud.registrar_linea(nombre, descripcion)
        db.commit()
        print(f"Línea creada exitosamente.")
        # Auditoría solo si el commit fue exitoso
        if usuario_actual:
            agregar_auditoria_usuario("CREATE", "lineas", usuario_actual)
    except Exception as e:
        print(f"Error al registrar la línea: {e}")
        db.rollback()
    finally:
        db_gen.close()


def generar_numero_tarjeta():

    generados = set()
    while True:
        numero = "".join(str(random.randint(0, 9)) for _ in range(16))
        if numero not in generados:
            generados.add(numero)
            return numero
