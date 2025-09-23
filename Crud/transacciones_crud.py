from sqlalchemy.orm import Session
from typing import List
from Entities.transaccion import Transaccion

from sqlalchemy import select, update
from Entities.usuario import Usuario
from datetime import datetime
import uuid


class TransaccionCRUD:

    def __init__(self, db: Session):
        self.db = db

    def registrar_transaccion(
        self, numero_tarjeta: str, tipo_transaccion: str, monto: float
    ) -> Transaccion:
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
