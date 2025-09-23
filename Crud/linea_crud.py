from sqlalchemy.orm import Session
from typing import List
from Entities.linea import Linea
from sqlalchemy import select, update
from Entities.usuario import Usuario
from datetime import datetime
import uuid


class LineaCRUD:
    def listar_lineas(self):
        return self.db.query(Linea).all()

    def __init__(self, db: Session):
        self.db = db

    def registrar_linea(self, nombre_linea: str, descripcion: str) -> Linea:

        linea = Linea(
            nombre=nombre_linea,
            descripcion=descripcion,
        )
        self.db.add(linea)
        self.db.commit()
        self.db.refresh(linea)
        return linea
