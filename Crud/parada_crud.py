from Entities.parada import Parada, ParadaCreate, ParadaUpdate
from uuid import UUID
from sqlalchemy.orm import Session


class ParadaCRUD:
    """Clase para operaciones CRUD en la entidad Parada

    Atributos:
        db (Session): Sesión de la base de datos
    """

    def __init__(self, db: Session):
        """Inicializa la clase ParadaCRUD con una sesión de base de datos.

        Args:
            db (Session): Sesión de la base de datos
        """
        self.db = db

    def registrar_parada(self, parada: ParadaCreate):
        """Registra una nueva parada en la base de datos.

        Args:
            parada (ParadaCreate): Datos de la nueva parada

        Returns:
            Parada: La nueva parada registrada
        """
        nueva = Parada(**parada.dict())
        self.db.add(nueva)
        self.db.commit()
        self.db.refresh(nueva)
        return nueva

    def modificar_parada(self, id_parada: UUID, parada_update: ParadaUpdate):
        """Modifica una parada existente en la base de datos.

        Args:
            id_parada (UUID): ID de la parada a modificar
            parada_update (ParadaUpdate): Datos actualizados de la parada

        Raises:
            ValueError: Si la parada no es encontrada

        Returns:
            Parada: La parada modificada
        """
        parada = self.db.query(Parada).get(id_parada)
        if not parada:
            raise ValueError("Parada no encontrada")
        for key, value in parada_update.dict(exclude_unset=True).items():
            setattr(parada, key, value)
        self.db.commit()
        self.db.refresh(parada)
        return parada

    def eliminar_parada(self, id_parada: UUID):
        """Elimina una parada de la base de datos.

        Args:
            id_parada (UUID): ID de la parada a eliminar

        Returns:
            bool: True si la parada fue eliminada, False si no fue encontrada
        """
        parada = self.db.query(Parada).get(id_parada)
        if parada:
            self.db.delete(parada)
            self.db.commit()
            return True
        return False

    def listar_paradas(self):
        return self.db.query(Parada).all()
