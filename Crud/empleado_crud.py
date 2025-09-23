from Entities.empleado import Empleado, EmpleadoCreate, EmpleadoUpdate
from uuid import UUID
from sqlalchemy.orm import Session

class EmpleadoCRUD:
    def __init__(self, db: Session):
        self.db = db

    def crear_empleado(self, empleado: EmpleadoCreate):
        nuevo = Empleado(**empleado.dict())
        self.db.add(nuevo)
        self.db.commit()
        self.db.refresh(nuevo)
        return nuevo

    def actualizar_empleado(self, id_empleado: UUID, empleado_update: EmpleadoUpdate):
        empleado = self.db.query(Empleado).get(id_empleado)
        if not empleado:
            raise ValueError("Empleado no encontrado")
        for key, value in empleado_update.dict(exclude_unset=True).items():
            setattr(empleado, key, value)
        self.db.commit()
        self.db.refresh(empleado)
        return empleado

    def eliminar_empleado(self, id_empleado: UUID):
        empleado = self.db.query(Empleado).get(id_empleado)
        if empleado:
            self.db.delete(empleado)
            self.db.commit()
            return True
        return False

    def listar_empleados(self):
        return self.db.query(Empleado).all()
