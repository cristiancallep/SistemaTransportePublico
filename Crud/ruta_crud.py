from sqlalchemy.orm import Session
from typing import List
from Entities.ruta import Ruta
from sqlalchemy import select, update
from Entities.usuario import Usuario
from datetime import datetime
import uuid


class RutaCRUD:
    """Clase para operaciones CRUD en la entidad Ruta
    Atributos:
        db (Session): Sesión de la base de datos
    Metodos:
        registrar_ruta: Registra una nueva ruta en la base de datos
        modificar_ruta: Modifica una ruta existente en la base de datos
    """

    def __init__(self, db: Session):
        self.db = db

    def registrar_ruta(
        self,
        nombre_ruta: str,
        origen: str,
        destino: str,
        duracion: float,
        id_linea=None,
    ) -> Ruta:
        """Registra una nueva ruta en la base de datos

        Args:
            nombre_ruta (str): Nombre de la ruta
            origen (str): Origen de la ruta
            destino (str): Destino de la ruta
            duracion (float): Duración estimada de la ruta en minutos
            id_linea (int, optional): ID de la línea asociada a la ruta.

        Returns:
            Ruta: Objeto de la ruta registrada
        """
        ruta = Ruta(
            nombre=nombre_ruta,
            origen=origen,
            destino=destino,
            duracion_estimada=duracion,
            id_linea=id_linea,
        )
        self.db.add(ruta)
        self.db.commit()
        self.db.refresh(ruta)
        return ruta

    def modificar_ruta(
        self, id_ruta: int, nombre_ruta: str, origen: str, destino: str, duracion: float
    ) -> None:
        """Modifica una ruta existente en la base de datos

        Args:
            id_ruta (int): ID de la ruta a modificar
            nombre_ruta (str): Nuevo nombre de la ruta
            origen (str): Nuevo origen de la ruta
            destino (str): Nuevo destino de la ruta
            duracion (float): Nueva duración estimada de la ruta en minutos

        Raises:
            ValueError: Si la ruta no es encontrada

        Returns:
            Ruta: Objeto de la ruta modificada"""
        ruta = self.db.query(Ruta).filter(Ruta.id_ruta == id_ruta).first()
        if not ruta:
            raise ValueError("Ruta no encontrada")

        ruta.nombre = nombre_ruta
        ruta.origen = origen
        ruta.destino = destino
        ruta.duracion_estimada = duracion
        ruta.fecha_actualizacion = datetime.now()

        self.db.commit()
        self.db.refresh(ruta)
        return ruta

    def listar_rutas(self):
        """Lista todas las rutas en la base de datos

        Returns:
            List[Ruta]: Lista de objetos de rutas
        """
        return self.db.query(Ruta).all()
