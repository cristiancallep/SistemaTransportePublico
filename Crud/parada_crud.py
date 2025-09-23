from Entities.parada import Parada, ParadaCreate, ParadaUpdate
from uuid import UUID
from sqlalchemy.orm import Session

class ParadaCRUD:
    def __init__(self, db: Session):
        self.db = db

    def registrar_parada(self, parada: ParadaCreate):
        nueva = Parada(**parada.dict())
        self.db.add(nueva)
        self.db.commit()
        self.db.refresh(nueva)
        return nueva

    def modificar_parada(self, id_parada: UUID, parada_update: ParadaUpdate):
        parada = self.db.query(Parada).get(id_parada)
        if not parada:
            raise ValueError("Parada no encontrada")
        for key, value in parada_update.dict(exclude_unset=True).items():
            setattr(parada, key, value)
        self.db.commit()
        self.db.refresh(parada)
        return parada

    def eliminar_parada(self, id_parada: UUID):
        parada = self.db.query(Parada).get(id_parada)
        if parada:
            self.db.delete(parada)
            self.db.commit()
            return True
        return False

    def listar_paradas(self):
        return self.db.query(Parada).all()
