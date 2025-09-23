from sqlalchemy.orm import Session
from typing import List
from Entities.tarjeta import Tarjeta
from sqlalchemy import select, update
from Entities.usuario import Usuario
from datetime import datetime
import uuid


class TarjetaCRUD:

    def __init__(self, db: Session):
        self.db = db

    def registrar_tarjeta(
        self,
        id_usuario: uuid.UUID,
        tipo_tarjeta: str,
        estado: str,
        numero_tarjeta: str,
        saldo,
    ) -> Tarjeta:
        tarjeta = Tarjeta(
            id_usuario=id_usuario,
            tipo_tarjeta=tipo_tarjeta,
            estado=estado,
            numero_tarjeta=numero_tarjeta,
            fecha_ultima_recarga=None,
            saldo=saldo,
        )
        self.db.add(tarjeta)
        self.db.commit()
        self.db.refresh(tarjeta)
        return tarjeta

    def recargar_tarjeta(self, documento: str, monto: float) -> Tarjeta:
        tarjeta = (
            self.db.query(Tarjeta)
            .join(Usuario, Usuario.id_usuario == Tarjeta.id_usuario)
            .filter(Usuario.documento == documento)
            .first()
        )
        if tarjeta:
            tarjeta.saldo += monto
            tarjeta.fecha_ultima_recarga = datetime.now()
            self.db.commit()
            self.db.refresh(tarjeta)
            return tarjeta
        else:
            raise ValueError(
                "Tarjeta no encontrada para el usuario con el documento proporcionado."
            )

    def obtener_saldo(self, documento: str) -> float:
        tarjeta = (
            self.db.query(Tarjeta)
            .join(Usuario, Usuario.id_usuario == Tarjeta.id_usuario)
            .filter(Usuario.documento == documento)
            .first()
        )
        if tarjeta:
            return tarjeta.saldo
        else:
            raise ValueError(
                "Tarjeta no encontrada para el usuario con el documento proporcionado."
            )

    def obtener_numero_tarjeta(self, id_usuario: uuid.UUID) -> str:
        tarjeta = (
            self.db.query(Tarjeta.numero_tarjeta)
            .filter(Tarjeta.id_usuario == id_usuario)
            .first()
        )
        return tarjeta[0] if tarjeta else None
