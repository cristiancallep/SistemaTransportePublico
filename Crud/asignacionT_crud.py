from Entities.asignacionT import AsignacionT, AsignacionTCreate, AsignacionTUpdate
from uuid import UUID
from sqlalchemy.orm import Session


class AsignacionTCRUD:
    """
    Clase CRUD para gestionar las operaciones
    relacionadas con la entidad AsignacionT.

    Atributos:
        db (Session): Sesión de la base de datos
    """

    def __init__(self, db: Session):
        self.db = db

    def registrar_asignacion(self, asignacion: AsignacionTCreate):
        """
        Registra una nueva asignación en la base de datos.

        Args:
            asignacion (AsignacionTCreate): Datos de la asignación a registrar.

        Returns:
            AsignacionT: La asignación registrada.
        """
        import uuid

        nueva = AsignacionT(id_asignacion=uuid.uuid4(), **asignacion.dict())
        self.db.add(nueva)
        self.db.commit()
        self.db.refresh(nueva)
        return nueva

    def obtener_por_usuario(self, id_usuario: UUID):
        """
        Obtiene todas las asignaciones realizadas a un usuario específico.

        Args:
            id_usuario (UUID): ID del usuario.

        Returns:
            List[AsignacionT]: Lista de asignaciones del usuario.
        """
        return self.db.query(AsignacionT).filter_by(id_usuario=id_usuario).all()

    def obtener_por_empleado(self, id_empleado: UUID):
        """
        Obtiene todas las asignaciones realizadas a un empleado específico.

        Args:
            id_empleado (UUID): ID del empleado.
        Returns:
            List[AsignacionT]: Lista de asignaciones del empleado.
        """
        return self.db.query(AsignacionT).filter_by(id_empleado=id_empleado).all()

    def obtener_por_transporte(self, id_transporte: UUID):
        return self.db.query(AsignacionT).filter_by(id_transporte=id_transporte).all()

    def eliminar_asignacion(self, id_asignacion: UUID):
        """
        Elimina una asignación por su ID.

        Args:
            id_asignacion (UUID): ID de la asignación a eliminar.

        Returns:
            bool: True si la asignación fue eliminada, False si no se encontró.
        """
        asignacion = self.db.query(AsignacionT).get(id_asignacion)
        if asignacion:
            self.db.delete(asignacion)
            self.db.commit()
            return True
        return False

    def listar_asignaciones(self):
        """
        Obtiene todas las asignaciones.

        Returns:
            List[AsignacionT]: Lista de todas las asignaciones.
        """
        return self.db.query(AsignacionT).all()
