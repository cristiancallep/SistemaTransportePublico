from Entities.transporte import Transporte, TransporteCreate, TransporteUpdate
from uuid import UUID
from sqlalchemy.orm import Session


class TransporteCRUD:
    """Clase para manejar operaciones CRUD de la entidad Transporte

    atributos:
        db: Session - Sesión de la base de datos
    """

    def __init__(self, db: Session):
        self.db = db

    def registrar_transporte(self, transporte: TransporteCreate):
        """Registra un nuevo transporte en la base de datos

        Args:
            transporte (TransporteCreate): Datos del transporte a registrar

        Returns:
            Transporte: El transporte registrado
        """
        nuevo = Transporte(**transporte.dict())
        self.db.add(nuevo)
        self.db.commit()
        self.db.refresh(nuevo)
        return nuevo

    def modificar_transporte(
        self, id_transporte: UUID, transporte_update: TransporteUpdate
    ):
        """Modifica un transporte existente en la base de datos

        Args:
            id_transporte (UUID): ID del transporte a modificar
            transporte_update (TransporteUpdate): Datos a modificar

        Raises:
            ValueError: Si el transporte no existe

        Returns:
            Transporte: El transporte modificado
        """
        transporte = self.db.query(Transporte).get(id_transporte)
        if not transporte:
            raise ValueError("Transporte no encontrado")
        for key, value in transporte_update.dict(exclude_unset=True).items():
            setattr(transporte, key, value)
        self.db.commit()
        self.db.refresh(transporte)
        return transporte

    def eliminar_transporte(self, id_transporte: UUID):
        """Elimina un transporte de la base de datos

        Args:
            id_transporte (UUID): ID del transporte a eliminar
        Returns:
            bool: True si se eliminó, False si no se encontró
        """
        transporte = self.db.query(Transporte).get(id_transporte)
        if transporte:
            self.db.delete(transporte)
            self.db.commit()
            return True
        return False

    def listar_transportes(self):
        """Lista todos los transportes en la base de datos

        Returns:
            List[Transporte]: Lista de transportes
        """
        return self.db.query(Transporte).all()
