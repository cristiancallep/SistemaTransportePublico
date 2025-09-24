from Entities.empleado import Empleado, EmpleadoCreate, EmpleadoUpdate
from uuid import UUID
from sqlalchemy.orm import Session


class EmpleadoCRUD:
    """CRUD para gestionar las operaciones de empleados.

    Atributos:
        db (Session): Sesión de la base de datos.
    """

    def __init__(self, db: Session):
        """Inicializa la clase con la sesión de la base de datos.

        Args:
            db (Session): Sesión de la base de datos.
        """
        self.db = db

    def crear_empleado(self, empleado: EmpleadoCreate):
        """Crea un nuevo empleado en la base de datos.

        Args:
            empleado (EmpleadoCreate): Datos del empleado a crear.

        Returns:
            Empleado: El empleado creado.
        """
        nuevo = Empleado(**empleado.dict())
        self.db.add(nuevo)
        self.db.commit()
        self.db.refresh(nuevo)
        return nuevo

    def actualizar_empleado(self, id_empleado: UUID, empleado_update: EmpleadoUpdate):
        """Actualiza los datos de un empleado existente.

        Args:
            id_empleado (UUID): ID del empleado a actualizar.
            empleado_update (EmpleadoUpdate): Datos actualizados del empleado.

        Raises:
            ValueError: Si el empleado no es encontrado.

        Returns:
            Empleado: El empleado actualizado.
        """
        empleado = self.db.query(Empleado).get(id_empleado)
        if not empleado:
            raise ValueError("Empleado no encontrado")
        for key, value in empleado_update.dict(exclude_unset=True).items():
            setattr(empleado, key, value)
        self.db.commit()
        self.db.refresh(empleado)
        return empleado

    def eliminar_empleado(self, id_empleado: UUID):
        """Elimina un empleado de la base de datos.

        Args:
            id_empleado (UUID): ID del empleado a eliminar.

        Returns:
            bool: True si el empleado fue eliminado, False si no fue encontrado.
        """
        empleado = self.db.query(Empleado).get(id_empleado)
        if empleado:
            self.db.delete(empleado)
            self.db.commit()
            return True
        return False

    def listar_empleados(self):
        """Lista todos los empleados en la base de datos.

        Returns:
            List[Empleado]: Lista de empleados.
        """
        return self.db.query(Empleado).all()
