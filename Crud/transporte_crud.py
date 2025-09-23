from Entities.transporte import Transporte, TransporteCreate, TransporteUpdate
from uuid import UUID
from sqlalchemy.orm import Session

class TransporteCRUD:
    def __init__(self, db: Session):
        self.db = db

    def registrar_transporte(self, transporte: TransporteCreate):
        nuevo = Transporte(**transporte.dict())
        self.db.add(nuevo)
        self.db.commit()
        self.db.refresh(nuevo)
        return nuevo

    def modificar_transporte(self, id_transporte: UUID, transporte_update: TransporteUpdate):
        transporte = self.db.query(Transporte).get(id_transporte)
        if not transporte:
            raise ValueError("Transporte no encontrado")
        for key, value in transporte_update.dict(exclude_unset=True).items():
            setattr(transporte, key, value)
        self.db.commit()
        self.db.refresh(transporte)
        return transporte

    def eliminar_transporte(self, id_transporte: UUID):
        transporte = self.db.query(Transporte).get(id_transporte)
        if transporte:
            self.db.delete(transporte)
            self.db.commit()
            return True
        return False

    def listar_transportes(self):
        return self.db.query(Transporte).all()
