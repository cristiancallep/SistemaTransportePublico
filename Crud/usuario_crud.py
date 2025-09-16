"""
Operaciones CRUD para Usuario
=============================

Este módulo contiene todas las operaciones de base de datos
para la entidad Usuario.
"""

from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
from datetime import datetime
from Entities import Usuario, UsuarioCreate, UsuarioUpdate

class UsuarioCRUD:
    """Clase para operaciones CRUD de Usuario"""
    
    def __init__(self, db: Session):
        self.db = db
    
    
    def crear_usuario(self, usuario_data: UsuarioCreate) -> Usuario:
        """
        Crea un nuevo usuario

        Args:
            usuario_data: Datos del usuario a crear

        Returns:
            Usuario: Usuario creado

        Raises:
            ValueError: Si el email ya existe
        """
        # Verificar si el email ya existe
        if self.obtener_por_email(usuario_data.email):  # ✅ sin self.db
            raise ValueError(f"El email {usuario_data.email} ya está registrado")

        # Crear instancia de Usuario
        usuario = Usuario(
            nombre=usuario_data.nombre,
            apellido=usuario_data.apellido,
            documento=usuario_data.documento,
            email=usuario_data.email,
            contrasena=usuario_data.contrasena,
            id_rol=getattr(usuario_data, "id_rol", 2)  # Por defecto cliente
        )

        # Guardar en la base de datos
        self.db.add(usuario)
        self.db.commit()
        self.db.refresh(usuario)
        return usuario
    
    def obtener_por_id(self, usuario_id: int) -> Optional[Usuario]:
        """Obtiene un usuario por su ID"""
        return self.db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()

    def obtener_por_email(self, email: str) -> Optional[Usuario]:
        """Obtiene un usuario por su email"""
        return self.db.query(Usuario).filter(Usuario.email == email).first()
    
    def obtener_por_contrasena(self, contrasena: str) -> Optional[Usuario]:
        """Obtiene un usuario por su contraseña"""
        return self.db.query(Usuario).filter(Usuario.contrasena == contrasena).first()

    def contar_usuarios(self) -> int:
        """Cuenta el total de usuarios"""
        return self.db.query(Usuario).count()
    
    def obtener_todos(
        self,
        skip: int = 0,
        limit: int = 100,
        filtro_nombre: Optional[str] = None,
        filtro_email: Optional[str] = None
    ) -> List[Usuario]:
        """Obtiene todos los usuarios con paginación y filtros opcionales"""
        query = self.db.query(Usuario)
        if filtro_nombre:
            query = query.filter(Usuario.nombre.ilike(f"%{filtro_nombre}%"))
        if filtro_email:
            query = query.filter(Usuario.email.ilike(f"%{filtro_email}%"))
        return query.order_by(Usuario.nombre).offset(skip).limit(limit).all()

    def buscar_usuarios(
        self,
        termino_busqueda: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[Usuario]:
        """Busca usuarios por nombre o email"""
        termino = f"%{termino_busqueda}%"
        return self.db.query(Usuario).filter(
            or_(
                Usuario.nombre.ilike(termino),
                Usuario.email.ilike(termino)
            )
        ).offset(skip).limit(limit).all()

    def actualizar_usuario(self, usuario_id: int, usuario_data: UsuarioUpdate) -> Optional[Usuario]:
        """Actualiza un usuario existente"""
        
        usuario = self.obtener_por_id(usuario_id)
        if not usuario:
            return None
        if usuario_data.email and usuario_data.email != usuario.email:
            usuario_existente = self.obtener_por_email(usuario_data.email)
            if usuario_existente:
                raise ValueError(f"El email {usuario_data.email} ya está registrado")
        update_data = usuario_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(usuario, field, value)
        usuario.fecha_registro = datetime.now()
        self.db.flush()
        self.db.refresh(usuario)
        return usuario

    def eliminar_usuario(self, usuario_id: int) -> bool:
        """Elimina un usuario y todas sus tarjetas en cascada"""
        usuario = self.db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
        if not usuario:
            return False
        self.db.delete(usuario)
        self.db.commit()
        return True