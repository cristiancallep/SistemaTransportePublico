from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from Entities.linea import Linea
from sqlalchemy.exc import IntegrityError


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

    def obtener_linea(self, id_linea: UUID) -> Linea | None:
        """Obtiene una línea por su ID."""
        return self.db.query(Linea).get(id_linea)

    def actualizar_linea(
        self, id_linea: UUID, nombre: str | None = None, descripcion: str | None = None
    ) -> Linea:
        """Actualiza una línea existente.

        Args:
            id_linea (UUID): ID de la línea a actualizar.
            nombre (str | None): Nuevo nombre (opcional).
            descripcion (str | None): Nueva descripción (opcional).

        Raises:
            ValueError: Si la línea no existe.

        Returns:
            Linea: La línea actualizada.
        """
        linea = self.db.query(Linea).get(id_linea)
        if not linea:
            raise ValueError("Línea no encontrada")
        if nombre is not None:
            linea.nombre = nombre
        if descripcion is not None:
            linea.descripcion = descripcion
        self.db.commit()
        self.db.refresh(linea)
        return linea

    def eliminar_linea(self, id_linea: UUID) -> bool:
        """Elimina una línea por su ID.

        Returns True si se eliminó, False si no existe.
        Puede lanzar IntegrityError si existen referencias.
        """
        linea = self.db.query(Linea).get(id_linea)
        if not linea:
            return False
        self.db.delete(linea)
        self.db.commit()
        return True
