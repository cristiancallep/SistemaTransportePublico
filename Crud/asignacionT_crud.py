from Entities.asignacionT import AsignacionT, AsignacionTCreate, AsignacionTUpdate
from uuid import UUID
from sqlalchemy.orm import Session


class AsignacionTCRUD:
    def __init__(self, db: Session):
        self.db = db

    def registrar_asignacion(self, asignacion: AsignacionTCreate):
        import uuid

        nueva = AsignacionT(id_asignacion=uuid.uuid4(), **asignacion.dict())
        self.db.add(nueva)
        self.db.commit()
        self.db.refresh(nueva)
        return nueva

    def obtener_por_usuario(self, id_usuario: UUID):
        return self.db.query(AsignacionT).filter_by(id_usuario=id_usuario).all()

    def obtener_por_empleado(self, id_empleado: UUID):
        return self.db.query(AsignacionT).filter_by(id_empleado=id_empleado).all()

    def obtener_por_transporte(self, id_transporte: UUID):
        return self.db.query(AsignacionT).filter_by(id_transporte=id_transporte).all()

    def eliminar_asignacion(self, id_asignacion: UUID):
        asignacion = self.db.query(AsignacionT).get(id_asignacion)
        if asignacion:
            self.db.delete(asignacion)
            self.db.commit()
            return True
        return False

    def listar_asignaciones(self):
        return self.db.query(AsignacionT).all()
