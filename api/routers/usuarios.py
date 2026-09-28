"""
Router para manejar operaciones relacionadas con usuarios.
===================================================

Endpoints FastAPI para operaciones CRUD de la entidad usuario.
Incluye crear, leer, actualizar y eliminar usuarios.
"""

from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from Crud.auditoria_crud import AuditoriaCRUD
from api.dependencies import get_db, get_current_user
from Crud.usuario_crud import UsuarioCRUD
from Entities.usuario import UsuarioCreate, UsuarioUpdate, UsuarioOut

router = APIRouter()


@router.get("/", response_model=List[UsuarioOut])
async def listar_usuarios(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0, description="Número de registros a saltar"),
    limit: int = Query(
        100, ge=1, le=1000, description="Número máximo de registros a retornar"
    ),
    rol: int = Query(
        None, description="Filtrar por rol del usuario, 1: admin, 2: cliente"
    ),
    current_user: dict = Depends(get_current_user),
):
    """
    Obtener lista de todos los usuarios.

    - **skip**: número de registros a saltar (para paginación)
    - **limit**: número máximo de registros a retornar
    - **rol**: filtrar usuarios por rol (opcional)
    """
    crud = UsuarioCRUD(db)
    usuarios = crud.listar_usuarios()

    if rol:
        usuarios = [e for e in usuarios if e.id_rol == rol]
    try:
        AuditoriaCRUD.agregar_auditoria_usuario("READ", "Usuario", current_user.get("user_id"))
    except Exception:
        # no bloquear la operación principal en caso de fallo en auditoría
        pass
    return usuarios[skip : skip + limit]


@router.get("/{usuario_id}", response_model=UsuarioOut)
async def obtener_usuario(usuario_id: UUID, db: Session = Depends(get_db)):
    """
    Obtener un usuario específico por su ID.

    - **usuario_id**: ID único del usuario
    """
    crud = UsuarioCRUD(db)
    usuarios = crud.listar_usuarios()

    usuarios = next((e for e in usuarios if str(e.id_usuario) == str(usuario_id)), None)

    if not usuarios:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    try:
        # intentar registrar auditoría si hay token válido
        # (No usamos Depends aquí para no forzar auth en este endpoint si no aplica)
        from api.dependencies import get_current_user
        # get_current_user requires token; calling it directly would need a request context.
        # Por simplicidad, intentamos registrar con el primer usuario (fallback) si es necesario.
        AuditoriaCRUD.agregar_auditoria_usuario("READ", "Usuario")
    except Exception:
        pass
    return usuarios


@router.get("/documento/{documento}", response_model=UsuarioOut)
async def obtener_usuario_por_documento(documento: str, db: Session = Depends(get_db)):
    """
    Obtener un usuario por su documento de identidad.

    - **documento**: documento de identidad del usuario
    """
    crud = UsuarioCRUD(db)
    usuarios = crud.listar_usuarios()

    usuario = next((e for e in usuarios if e.documento == documento), None)

    if not usuario:
        raise HTTPException(
            status_code=404, detail="usuario con ese documento no encontrado"
        )
    try:
        AuditoriaCRUD.agregar_auditoria_usuario("READ", "Usuario")
    except Exception:
        pass
    return usuario


@router.get("/email/{email}", response_model=UsuarioOut)
async def obtener_usuario_por_email(email: str, db: Session = Depends(get_db)):
    """
    Obtener un usuario por su email.

    - **email**: correo electrónico del usuario
    """
    crud = UsuarioCRUD(db)
    usuarios = crud.listar_usuarios()

    usuario = next((e for e in usuarios if e.email == email), None)

    if not usuario:
        raise HTTPException(
            status_code=404, detail="usuario con ese email no encontrado"
        )
    try:
        AuditoriaCRUD.agregar_auditoria_usuario("READ", "Usuario")
    except Exception:
        pass
    return usuario


@router.post("/", response_model=UsuarioOut, status_code=201)
async def crear_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    """
    Crear un nuevo usuario.

    - **nombre**: nombre del usuario
    - **apellido**: apellido del usuario
    - **documento**: documento de identidad único
    - **email**: correo electrónico único
    - **rol**: rol del usuario en el sistema
    """
    try:
        crud = UsuarioCRUD(db)
        nuevo_usuario = crud.crear_usuario(usuario)
        try:
            AuditoriaCRUD.agregar_auditoria_usuario("CREATE", "Usuario")
        except Exception:
            pass
        return nuevo_usuario
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al crear usuario: {str(e)}")


@router.put("/{usuario_id}", response_model=UsuarioOut)
async def actualizar_usuario(
    usuario_id: UUID, usuario_update: UsuarioUpdate, db: Session = Depends(get_db)
):
    """
    Actualizar un usuario existente.

    - **usuario_id**: ID único del usuario a actualizar
    - Campos opcionales a actualizar: nombre, apellido, email, rol, estado
    """
    try:
        crud = UsuarioCRUD(db)
        usuario_actualizado = crud.actualizar_usuario(usuario_id, usuario_update)
        try:
            AuditoriaCRUD.agregar_auditoria_usuario("UPDATE", "Usuario")
        except Exception:
            pass
        return usuario_actualizado
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error al actualizar usuario: {str(e)}"
        )


@router.delete("/{usuario_id}")
async def eliminar_usuario(usuario_id: UUID, db: Session = Depends(get_db)):
    """
    Eliminar un usuario.

    - **usuario_id**: ID único del usuario a eliminar
    """
    crud = UsuarioCRUD(db)
    eliminado = crud.eliminar_usuario(usuario_id)

    if not eliminado:
        raise HTTPException(status_code=404, detail="usuario no encontrado")
    try:
        AuditoriaCRUD.agregar_auditoria_usuario("DELETE", "Usuario")
    except Exception:
        pass
    return {"message": "usuario eliminado correctamente"}
