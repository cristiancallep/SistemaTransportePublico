from sqlalchemy.orm import Session
from typing import List
from Entities.transaccion import Transaccion

from sqlalchemy import select, update
from Entities.usuario import Usuario
from Entities.tarjeta import Tarjeta
from datetime import datetime
import uuid


class TransaccionCRUD:
    """CRUD operaciones para la entidad Transaccion.

    Atributos:
        db (Session): Sesión de la base de datos.
    """

    def __init__(self, db: Session):
        self.db = db

    def registrar_transaccion(
        self, numero_tarjeta: str, tipo_transaccion: str, monto: float
    ) -> Transaccion:
        """Registra una nueva transacción en la base de datos.

        Args:
            numero_tarjeta (str): Número de la tarjeta asociada a la transacción.
            tipo_transaccion (str): Tipo de transacción (e.g., 'recarga', 'pago').
            monto (float): Monto de la transacción.

        Returns:
            Transaccion: La transacción registrada.
        """
        transaccion = Transaccion(
            id_transaccion=uuid.uuid4(),
            numero_tarjeta=numero_tarjeta,
            tipo_transaccion=tipo_transaccion,
            monto=monto,
            fecha_transaccion=datetime.now(),
        )
        self.db.add(transaccion)
        self.db.commit()
        self.db.refresh(transaccion)
        return transaccion

    def obtener_transacciones_por_usuario_id(
        self, usuario_id: uuid.UUID
    ) -> List[Transaccion]:
        """Obtiene las transacciones asociadas a la tarjeta de un usuario por su ID.

        Args:
            usuario_id (uuid.UUID): ID del usuario.

        Returns:
            List[Transaccion]: Lista de transacciones asociadas a la tarjeta del usuario.
        """
        transacciones = (
            self.db.query(Transaccion)
            .join(Tarjeta, Tarjeta.numero_tarjeta == Transaccion.numero_tarjeta)
            .join(Usuario, Usuario.id_usuario == Tarjeta.id_usuario)
            .filter(Usuario.id_usuario == usuario_id)
            .all()
        )
        return transacciones

    def obtener_todas_transacciones(self) -> List[Transaccion]:
        """Obtiene todas las transacciones en la base de datos."""
        transacciones = self.db.query(Transaccion).all()
        return transacciones
