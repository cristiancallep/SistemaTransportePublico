from sqlalchemy.orm import Session
from typing import List
from Entities.tarjeta import Tarjeta
from sqlalchemy import select, update
from Entities.usuario import Usuario
from datetime import datetime
import uuid
from fastapi import HTTPException
import random
from Crud.transacciones_crud import TransaccionCRUD


class TarjetaCRUD:
    """
    CRUD operaciones para la entidad Tarjeta.

    Atributos:
        db (Session): Sesión de la base de datos.
    """

    def __init__(self, db: Session):
        """
        Inicializa la clase TarjetaCRUD con una sesión de base de datos.

        Args:
            db (Session): Sesión de la base de datos.
        """
        self.db = db

    def registrar_tarjeta(
        self,
        id_usuario: uuid.UUID,
        tipo_tarjeta: str,
        estado: str,
        # numero_tarjeta: str,
        saldo,
    ) -> Tarjeta:
        """Registra una nueva tarjeta en la base de datos.

        Args:
            id_usuario (uuid.UUID): ID del usuario al que pertenece la tarjeta.
            tipo_tarjeta (str): Tipo de la tarjeta (e.g., 'Frecuente', 'Estudiante').
            estado (str): Estado de la tarjeta (e.g., 'Activa', 'Inactiva').
            numero_tarjeta (str): Número único de la tarjeta.
            saldo (float): Saldo inicial de la tarjeta.

        Returns:
            Tarjeta: La tarjeta recién creada.
        """
        numero_tarjeta = self.generar_numero_tarjeta()
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

    def generar_numero_tarjeta(self) -> str:
        """Genera un número de tarjeta único.

        Returns:
            str: Número de tarjeta generado.
        """

        while True:
            numero = "".join(str(random.randint(0, 9)) for _ in range(16))
            existe = (
                self.db.query(Tarjeta).filter(Tarjeta.numero_tarjeta == numero).first()
            )
            if not existe:
                return numero

    def recargar_tarjeta(self, documento: str, monto: float) -> Tarjeta:
        """Recarga el saldo de una tarjeta asociada a un usuario por su documento.

        Args:
            documento (str): Documento del usuario.
            monto (float): Monto a recargar.

        Raises:
            ValueError: Si no se encuentra la tarjeta para el usuario con el documento proporcionado.

        Returns:
            Tarjeta: La tarjeta actualizada con el nuevo saldo.
        """
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
            raise HTTPException(
                status_code=404,
                detail="Tarjeta no encontrada para el usuario con el documento proporcionado.",
            )

    def obtener_saldo(self, documento: str) -> float:
        """Obtiene el saldo de una tarjeta asociada a un usuario por su documento.

        Args:
            documento (str): Documento del usuario.

        Raises:
            ValueError: Si no se encuentra la tarjeta para el usuario con el documento proporcionado.

        Returns:
            float: El saldo de la tarjeta.
        """
        tarjeta = (
            self.db.query(Tarjeta)
            .join(Usuario, Usuario.id_usuario == Tarjeta.id_usuario)
            .filter(Usuario.documento == documento)
            .first()
        )
        if tarjeta:

            return tarjeta.saldo
        else:
            raise HTTPException(
                status_code=404,
                detail="Tarjeta no encontrada para el usuario con el documento proporcionado.",
            )

    def obtener_numero_tarjeta(self, id_usuario: uuid.UUID) -> str:
        """Obtiene el número de tarjeta asociado a un usuario por su ID.

        Args:
            id_usuario (uuid.UUID): ID del usuario.
        Returns:
            str: El número de la tarjeta.
        """
        tarjeta = (
            self.db.query(Tarjeta.numero_tarjeta)
            .filter(Tarjeta.id_usuario == id_usuario)
            .first()
        )
        return tarjeta[0] if tarjeta else None
