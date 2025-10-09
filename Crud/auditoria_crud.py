"""
Operaciones CRUD para Auditoria
===============================

Este módulo contiene todas las operaciones de base de datos
para la entidad Auditoria.
"""

from sqlalchemy.orm import Session
from typing import List
from Entities import Auditoria
from api.dependencies import get_db


class AuditoriaCRUD:
    """Clase para operaciones CRUD de Auditoria"""

    def __init__(self, db: Session):
        self.db = db

    def registrar_evento(
        self, usuario_id: int, tabla_afectada: str, accion: str, descripcion: str
    ) -> Auditoria:
        """
        Registra un evento en la tabla de auditoría.

        Args:
            usuario_id (int): ID del usuario que realizó la acción.
            tabla_afectada (str): Nombre de la tabla afectada.
            accion (str): Tipo de acción realizada (CREATE, UPDATE, DELETE, LOGIN, etc).
            descripcion (str): Descripción detallada de la acción.
        """
        auditoria = Auditoria(
            id_usuario=usuario_id,
            tabla_afectada=tabla_afectada,
            accion=accion,
            descripcion=descripcion,
        )

        self.db.add(auditoria)
        self.db.commit()
        self.db.refresh(auditoria)

        return auditoria

    def obtener_todas(self, skip: int = 0, limit: int = 100) -> List[Auditoria]:
        """
        Obtiene todas las auditorías con paginación.

        """
        return (
            self.db.query(Auditoria)
            .order_by(Auditoria.fecha.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def agregar_auditoria_usuario(nombre_accion: str, nombre_tabla: str):
        """
        Método para agregar un registro a la tabla auditoria
        """
        db_gen = get_db()
        db = next(db_gen)
        try:
            auditoria_crud = AuditoriaCRUD(db)
            auditoria_crud.registrar_evento(
                usuario_id="7d1a4c4c-7427-4ea0-b377-2f9d5e20fbf8",
                tabla_afectada=nombre_tabla,
                accion=nombre_accion,
                descripcion=(f"{nombre_accion} en {nombre_tabla}"),
            )
            db.commit()
        except Exception as e:
            print(f"Error al registrar auditoría: {e}")
            db.rollback()
        finally:
            db_gen.close()
