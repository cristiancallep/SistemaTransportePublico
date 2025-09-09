"""
Operaciones CRUD para Tarjeta
=============================

Este módulo contiene todas las operaciones de base de datos
para la entidad Tarjeta.
"""

from pydantic_core import ValidationError
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional, Dict, Any
from datetime import datetime
from decimal import Decimal

from Entities import Tarjeta, TarjetaCreate, TarjetaUpdate
from database import get_session_context

class TarjetaCRUD:
    """Clase para operaciones CRUD de Tarjeta"""
    
    @staticmethod
    def crear_tarjeta(tarjeta_data: TarjetaCreate) -> Tarjeta:
        """Crea una nueva tarjeta para un usuario, validando duplicados en BD."""
        with get_session_context() as session:
            # Verificar si el usuario ya tiene tarjeta
            if session.query(Tarjeta).filter(Tarjeta.id_usuario == tarjeta_data.id_usuario).first():
                raise ValueError(f"El usuario ID {tarjeta_data.id_usuario} ya tiene una tarjeta asignada")

            # Verificar si el número ya existe
            if session.query(Tarjeta).filter(Tarjeta.numero_tarjeta == tarjeta_data.numero_tarjeta).first():
                raise ValueError(f"El número de tarjeta {tarjeta_data.numero_tarjeta} ya está registrado")

            # Crear la tarjeta
            tarjeta = Tarjeta(**tarjeta_data.dict())

            session.add(tarjeta)
            session.flush()
            session.refresh(tarjeta)

            return tarjeta
        
    # Metodos de consulta
    @staticmethod
    def obtener_por_id(session: Session, tarjeta_id: int) -> Optional[Tarjeta]:
        """
        Obtiene una tarjeta por su ID
        
        Args:
            session: Sesión de base de datos
            tarjeta_id: ID de la tarjeta
            
        Returns:
            Tarjeta o None si no existe
        """
        return session.query(Tarjeta).filter(Tarjeta.id_tarjeta == tarjeta_id).first()
    
    @staticmethod
    def obtener_por_usuario(session: Session, usuario_id: int) -> Optional[Tarjeta]:
        """
        Obtiene la tarjeta de un usuario (cada usuario solo tiene 1)
        
        Args:
            session: Sesión de base de datos
            usuario_id: ID del usuario
            
        Returns:
            Tarjeta o None si no existe
        """
        return session.query(Tarjeta).filter(Tarjeta.id_usuario == usuario_id).first()
    
    @staticmethod
    def obtener_por_numero(session: Session, numero_tarjeta: str) -> Optional[Tarjeta]:
        """
        Obtiene una tarjeta por su número
        
        Args:
            session: Sesión de base de datos
            numero_tarjeta: Número de la tarjeta
            
        Returns:
            Tarjeta o None si no existe
        """
        return session.query(Tarjeta).filter(Tarjeta.numero_tarjeta == numero_tarjeta).first()
    
    @staticmethod
    def obtener_todas(
        session: Session,
        skip: int = 0,
        limit: int = 100,
        estado: Optional[str] = None
    ) -> List[Tarjeta]:
        """
        Obtiene todas las tarjetas con paginación
        
        Args:
            session: Sesión de base de datos
            skip: Número de registros a saltar
            limit: Número máximo de registros a retornar
            estado: Filtrar por estado de la tarjeta
            
        Returns:
            Lista de tarjetas
        """
        query = session.query(Tarjeta)
        
        if estado:
            query = query.filter(Tarjeta.estado == estado)
        
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def buscar_tarjetas(
        session: Session,
        termino_busqueda: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[Tarjeta]:
        """
        Busca tarjetas por número o tipo
        
        Args:
            session: Sesión de base de datos
            termino_busqueda: Término a buscar
            skip: Número de registros a saltar
            limit: Número máximo de registros a retornar
            
        Returns:
            Lista de tarjetas que coinciden
        """
        termino = f"%{termino_busqueda}%"
        return session.query(Tarjeta).filter(
            or_(
                Tarjeta.numero_tarjeta.ilike(termino),
                Tarjeta.tipo_tarjeta.ilike(termino)
            )
        ).offset(skip).limit(limit).all()
    
    # metodos de actualizacion y eliminacion
    @staticmethod
    def actualizar_tarjeta(tarjeta_id: int, tarjeta_data: TarjetaUpdate) -> Optional[Tarjeta]:
        """
        Actualiza una tarjeta existente
        
        Args:
            tarjeta_id: ID de la tarjeta a actualizar
            tarjeta_data: Datos a actualizar
            
        Returns:
            Tarjeta actualizada o None si no existe
            
        Raises:
            ValueError: Si el número de tarjeta ya existe en otra tarjeta
        """
        with get_session_context() as session:
            tarjeta = TarjetaCRUD.obtener_por_id(session, tarjeta_id)
            
            if not tarjeta:
                return None
            
            # Verificar si el número de tarjeta ya existe en otra tarjeta
            if tarjeta_data.numero_tarjeta and tarjeta_data.numero_tarjeta != tarjeta.numero_tarjeta:
                tarjeta_existente = TarjetaCRUD.obtener_por_numero(session, tarjeta_data.numero_tarjeta)
                if tarjeta_existente:
                    raise ValueError(f"El número de tarjeta {tarjeta_data.numero_tarjeta} ya está registrado")
            
            # Actualizar campos
            update_data = tarjeta_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(tarjeta, field, value)
            
            # Si se actualiza el saldo, actualizar fecha de última recarga
            if 'saldo' in update_data:
                tarjeta.fecha_ultima_recarga = datetime.now()
            
            session.flush()
            session.refresh(tarjeta)
            
            return tarjeta
    
    @staticmethod
    def desactivar_tarjeta(tarjeta_id: int) -> bool:
        """
        Desactiva una tarjeta (cambia estado a 'Inactiva')
        
        Args:
            tarjeta_id: ID de la tarjeta a desactivar
            
        Returns:
            True si se desactivó correctamente, False si no existe
        """
        with get_session_context() as session:
            tarjeta = TarjetaCRUD.obtener_por_id(session, tarjeta_id)
            
            if not tarjeta:
                return False
            
            tarjeta.estado = "Inactiva"
            tarjeta.fecha_ultima_recarga = datetime.now()
            
            return True
    
    @staticmethod
    def eliminar_tarjeta_permanente(tarjeta_id: int) -> bool:
        """
        Elimina permanentemente una tarjeta de la base de datos
        
        Args:
            tarjeta_id: ID de la tarjeta a eliminar
            
        Returns:
            True si se eliminó correctamente, False si no existe
        """
        with get_session_context() as session:
            tarjeta = TarjetaCRUD.obtener_por_id(session, tarjeta_id)
            
            if not tarjeta:
                return False
            
            session.delete(tarjeta)
            return True
    
    @staticmethod
    def contar_tarjetas(session: Session, estado: Optional[str] = None) -> int:
        """
        Cuenta el total de tarjetas
        
        Args:
            session: Sesión de base de datos
            estado: Filtrar por estado de la tarjeta
            
        Returns:
            Número total de tarjetas
        """
        query = session.query(Tarjeta)
        
        if estado:
            query = query.filter(Tarjeta.estado == estado)
        
        return query.count()
    

    @staticmethod
    def recargar_saldo_usuario(usuario_id: int, monto: Decimal) -> Optional[Tarjeta]:
        """
        Recarga saldo a la tarjeta de un usuario
        
        Args:
            usuario_id: ID del usuario
            monto: Monto a recargar
            
        Returns:
            Tarjeta actualizada o None si no existe
            
        Raises:
            ValueError: Si el monto no es positivo o el usuario no tiene tarjeta
        """
        if monto <= 0:
            raise ValueError("El monto de recarga debe ser positivo")
        
        with get_session_context() as session:
            tarjeta = TarjetaCRUD.obtener_por_usuario(session, usuario_id)
            
            if not tarjeta:
                raise ValueError(f"El usuario ID {usuario_id} no tiene una tarjeta asignada")
            
            tarjeta.saldo += monto
            tarjeta.fecha_ultima_recarga = datetime.now()
            
            session.flush()
            session.refresh(tarjeta)
            
            return tarjeta
    
    @staticmethod
    def obtener_estadisticas(session: Session) -> Dict[str, Any]:
        """
        Obtiene estadísticas de tarjetas
        
        Args:
            session: Sesión de base de datos
            
        Returns:
            Diccionario con estadísticas
        """
        total = TarjetaCRUD.contar_tarjetas(session)
        activas = TarjetaCRUD.contar_tarjetas(session, estado="Activa")
        inactivas = TarjetaCRUD.contar_tarjetas(session, estado="Inactiva")
        
        return {
            'total_tarjetas': total,
            'tarjetas_activas': activas,
            'tarjetas_inactivas': inactivas,
            'porcentaje_activas': (activas / total * 100) if total > 0 else 0,
        }