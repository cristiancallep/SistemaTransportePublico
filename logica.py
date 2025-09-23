from Entities import usuario
from database import get_db, create_tables
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
from Crud.tarjeta_crud import TarjetaCRUD
from Crud.transacciones_crud import TransaccionCRUD
from Crud.ruta_crud import RutaCRUD
from Crud.linea_crud import LineaCRUD
import random


def crear_tarjeta(
    documento: str, tipo_tarjeta="Frecuentes", estado="Activa", saldo=0.0
) -> None:
    create_tables()
    db_gen = get_db()
    db = next(db_gen)
    numero = generar_numero_tarjeta()
    try:
        tarjeta_crud = TarjetaCRUD(db)
        id_usuario = db.execute(
            select(usuario.Usuario).where(usuario.Usuario.documento == documento)
        ).scalar_one_or_none()

        if not id_usuario:
            print(f"No se encontró un usuario con el documento: {documento}")
            return
        id_usuario = id_usuario.id_usuario

        tarjeta_crud.registrar_tarjeta(id_usuario, tipo_tarjeta, estado, numero, saldo)
        db.commit()
        print(f"Tarjeta creada exitosamente con número: {numero}")
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

        else:
            print(
                "No se encontró la tarjeta para el usuario con el documento proporcionado."
            )
    except Exception as e:
        print(f"Error al consultar el saldo: {e}")
    finally:
        db_gen.close()


def generar_ruta(nombre_ruta: str, origen: str, destino: str, duracion: float) -> None:
    create_tables()
    db_gen = get_db()
    db = next(db_gen)
    try:
        ruta_crud = RutaCRUD(db)
        ruta_crud.registrar_ruta(nombre_ruta, origen, destino, duracion)
        db.commit()
        print(f"Ruta {nombre_ruta} creada exitosamente.")
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
