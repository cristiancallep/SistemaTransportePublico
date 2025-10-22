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
from Entities.auth import LoginRequest, LoginResponse, RefreshTokenRequest


router = APIRouter()

# Configuración de seguridad
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
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
