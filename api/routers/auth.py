"""
Router para manejar autenticación y autorización.
===============================================

Endpoints FastAPI para login, logout, refresh tokens y validación.
"""

import os
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from api.dependencies import get_db
from Crud.usuario_crud import UsuarioCRUD
from Entities.auth import (
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)


router = APIRouter()

# Configuración de seguridad - usando configuración específica para evitar conflictos
pwd_context = CryptContext(
    schemes=["pbkdf2_sha256", "bcrypt"],  # pbkdf2_sha256 como fallback
    default="pbkdf2_sha256",  # Usar pbkdf2 por defecto
    deprecated="auto",
)
security = HTTPBearer()

# Configuración JWT (en producción usar variables de entorno)
SECRET_KEY = os.getenv(
    "SECRET_KEY", "tu_clave_secreta_super_segura_cambiar_en_produccion"
)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 30


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verificar si la contraseña coincide con el hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Generar hash de la contraseña."""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """Crear token de acceso JWT."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict):
    """Crear token de refresco JWT."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@router.post("/login", response_model=LoginResponse)
async def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """
    Iniciar sesión con email y contraseña.

    Busca las credenciales en la base de datos real.
    """
    crud = UsuarioCRUD(db)

    try:
        # Validar credenciales contra la base de datos
        usuario = crud.validar_credenciales(credentials.email, credentials.password)

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
        )

    # Crear tokens usando los datos del usuario real
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": usuario.email, "user_id": str(usuario.id_usuario)},
        expires_delta=access_token_expires,
    )
    refresh_token = create_refresh_token(
        data={"sub": usuario.email, "user_id": str(usuario.id_usuario)}
    )

    # Convertir usuario a diccionario usando datos reales
    user_dict = {
        "id": str(usuario.id_usuario),
        "nombre": str(usuario.nombre),
        "apellido": str(usuario.apellido),
        "email": str(usuario.email),
        "telefono": "",
        "fechaRegistro": datetime.now().isoformat(),
        "estado": "activo",
        "rolId": 1,  # Por ahora asignar rol admin
        "rol": {
            "id": 1,
            "nombre": "Administrador",
            "permisos": [
                "usuarios:leer",
                "usuarios:crear",
                "usuarios:editar",
                "usuarios:eliminar",
                "tarjetas:leer",
                "tarjetas:crear",
                "tarjetas:editar",
                "tarjetas:recargar",
                "transportes:leer",
                "transportes:crear",
                "transportes:editar",
                "empleados:leer",
                "empleados:crear",
                "empleados:editar",
                "reportes:ver",
                "admin:configuracion",
            ],
        },
    }

    return LoginResponse(
        accessToken=access_token,
        refreshToken=refresh_token,
        user=user_dict,
        expiresIn=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/refresh")
async def refresh_token(request: RefreshTokenRequest):
    """Refrescar el token de acceso."""
    try:
        payload = jwt.decode(request.refreshToken, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        user_id = payload.get("user_id")

        if email is None or user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")

        # Crear nuevo access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": email, "user_id": user_id}, expires_delta=access_token_expires
        )

        return {
            "accessToken": access_token,
            "expiresIn": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        }

    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")


@router.post("/logout")
async def logout():
    """Cerrar sesión (invalidar tokens)."""
    # En una implementación completa, aquí invalidarías los tokens
    # Por ahora solo retornamos éxito
    return {"message": "Sesión cerrada exitosamente"}


@router.get("/me")
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    """Obtener información del usuario actual."""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")

        if email is None:
            raise HTTPException(status_code=401, detail="Token inválido")

        crud = UsuarioCRUD(db)
        usuarios = crud.listar_usuarios()

        for usuario in usuarios:
            if usuario.email == email:
                return {
                    "id": str(usuario.id),
                    "nombre": usuario.nombre,
                    "apellido": usuario.apellido,
                    "email": usuario.email,
                    "telefono": usuario.telefono,
                    "fechaRegistro": usuario.fecha_registro.isoformat(),
                    "estado": usuario.estado,
                    "rolId": usuario.id_rol,
                }

        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")


@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest, db: Session = Depends(get_db)
):
    """
    Solicitar recuperación de contraseña.

    En un entorno real, esto enviaría un email con un enlace de recuperación.
    Por ahora, solo validamos que el usuario existe.
    """
    crud = UsuarioCRUD(db)

    try:
        # Verificar si el usuario existe
        usuarios = crud.listar_usuarios()
        usuario_encontrado = None

        for usuario in usuarios:
            if str(usuario.email) == request.email:
                usuario_encontrado = usuario
                break

        if not usuario_encontrado:
            # Por seguridad, no revelamos si el email existe o no
            return {
                "message": "Si el email existe, recibirás instrucciones para recuperar tu contraseña"
            }

        # Aquí normalmente enviarías un email con el token de recuperación
        # Por ahora solo retornamos éxito
        return {
            "message": "Si el email existe, recibirás instrucciones para recuperar tu contraseña"
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor",
        )


@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Restablecer contraseña con email y nueva contraseña.

    En un entorno real, esto requeriría un token de recuperación.
    Por simplicidad, permitimos el cambio solo con email.
    """
    if request.new_password != request.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Las contraseñas no coinciden",
        )

    if len(request.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La contraseña debe tener al menos 6 caracteres",
        )

    crud = UsuarioCRUD(db)

    try:
        print(f"DEBUG: Buscando usuario con email: {request.email}")
        # Buscar usuario por email
        usuarios = crud.listar_usuarios()
        usuario_encontrado = None

        print(f"DEBUG: Se encontraron {len(usuarios)} usuarios en total")
        for usuario in usuarios:
            print(f"DEBUG: Comparando '{str(usuario.email)}' con '{request.email}'")
            if str(usuario.email) == request.email:
                usuario_encontrado = usuario
                print(f"DEBUG: Usuario encontrado: {usuario_encontrado.id_usuario}")
                break

        if not usuario_encontrado:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado"
            )

        # Actualizar contraseña (pasamos la contraseña en texto plano, el CRUD generará el hash)
        print(
            f"DEBUG: Contraseña recibida: '{request.new_password}' (longitud: {len(request.new_password)})"
        )
        print(f"DEBUG: Tipo de contraseña: {type(request.new_password)}")
        print(
            f"DEBUG: Actualizando contraseña para usuario ID: {usuario_encontrado.id_usuario}"
        )

        try:
            success = crud.actualizar_contrasena(
                usuario_encontrado.id_usuario, request.new_password
            )
            print(f"DEBUG: Actualización exitosa: {success}")
        except Exception as e:
            print(f"DEBUG ERROR en actualizar_contrasena: {str(e)}")
            print(f"DEBUG ERROR tipo: {type(e)}")
            raise

        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al actualizar la contraseña",
            )

        return {"message": "Contraseña actualizada exitosamente"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}",
        )
