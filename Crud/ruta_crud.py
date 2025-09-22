from sqlalchemy.orm import Session
from typing import List
from Entities.ruta import Ruta
from sqlalchemy import select, update
from Entities.usuario import Usuario
from datetime import datetime
import uuid


class RutaCRUD:

    def __init__(self, db: Session):
        self.db = db

    def registrar_ruta(
        self, nombre_ruta: str, origen: str, destino: str, duracion: float
    ) -> Ruta:
        ruta = Ruta(
            nombre=nombre_ruta,
            origen=origen,
            destino=destino,
            duracion_estimada=duracion,
        )
        self.db.add(ruta)
        self.db.commit()
        self.db.refresh(ruta)
        return ruta

    def modificar_ruta(
        self, id_ruta: int, nombre_ruta: str, origen: str, destino: str, duracion: float
    ) -> None:
        ruta = self.db.query(Ruta).filter(Ruta.id_ruta == id_ruta).first()
        if not ruta:
            raise ValueError("Ruta no encontrada")

        ruta.nombre = nombre_ruta
        ruta.origen = origen
        ruta.destino = destino
        ruta.duracion_estimada = duracion

        self.db.commit()
        self.db.refresh(ruta)
        return ruta
