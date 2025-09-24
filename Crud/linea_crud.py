from sqlalchemy.orm import Session
from typing import List
from Entities.linea import Linea
from sqlalchemy import select, update
from Entities.usuario import Usuario
from datetime import datetime
import uuid


class LineaCRUD:
    """Clase para operaciones CRUD en la entidad Linea

    Atributos:
        db (Session): Sesión de la base de datos.
    """

    def listar_lineas(self):
        """Lista todas las líneas en la base de datos.

        Returns:
            List[Linea]: Lista de todas las líneas.
        """
        return self.db.query(Linea).all()

    def __init__(self, db: Session):
        """Inicializa la clase LineaCRUD con una sesión de base de datos.

        Args:
            db (Session): Sesión de la base de datos.
        """
        self.db = db

    def registrar_linea(self, nombre_linea: str, descripcion: str) -> Linea:
        """Registra una nueva línea en la base de datos.

        Args:
            nombre_linea (str): Nombre de la línea.
            descripcion (str): Descripción de la línea.

        Returns:
            Linea: La línea recién creada.
        """

        linea = Linea(
            nombre=nombre_linea,
            descripcion=descripcion,
        )
        self.db.add(linea)
        self.db.commit()
        self.db.refresh(linea)
        return linea
