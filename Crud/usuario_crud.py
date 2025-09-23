from sqlalchemy.orm import Session
from Entities import Usuario, UsuarioCreate, UsuarioUpdate
import bcrypt


class UsuarioCRUD:
    def __init__(self, db: Session):
        self.db = db

    def crear_usuario(self, usuario_data: UsuarioCreate):
        """Crea un usuario nuevo en la base de datos"""

        if self.db.query(Usuario).filter(Usuario.email == usuario_data.email).first():
            raise ValueError("El email ya está registrado")

        if (
            self.db.query(Usuario)
            .filter(Usuario.documento == usuario_data.documento)
            .first()
        ):
            raise ValueError("El documento ya está registrado")

        if len(usuario_data.contrasena) < 6:
            raise ValueError("La contraseña debe tener al menos 6 caracteres")

        hashed_password = bcrypt.hashpw(
            usuario_data.contrasena.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

        nuevo_usuario = Usuario(
            id_rol=usuario_data.id_rol or 2,  # Por defecto rol cliente
            nombre=usuario_data.nombre.strip().title(),
            apellido=usuario_data.apellido.strip().title(),
            documento=usuario_data.documento.strip(),
            email=usuario_data.email.lower().strip(),
            contrasena=hashed_password,
        )

        self.db.add(nuevo_usuario)
        self.db.commit()
        self.db.refresh(nuevo_usuario)

        return nuevo_usuario

    def obtener_por_email(self, email: str):
        """
        Busca un usuario por su email

        """
        return (
            self.db.query(Usuario)
            .filter(Usuario.email == email.lower().strip())
            .first()
        )

    def validar_credenciales(self, email: str, contrasena: str) -> Usuario:
        """
        Verifica si el email y la contraseña son correctos

        """
        usuario = self.obtener_por_email(email)
        if not usuario:
            raise ValueError("Usuario no encontrado")

        if not bcrypt.checkpw(
            contrasena.encode("utf-8"), usuario.contrasena.encode("utf-8")
        ):
            raise ValueError("Contraseña incorrecta")

        return usuario

    def actualizar_usuario(self, usuario_id: int, usuario_update: UsuarioUpdate):
        """
        Metodo para actualizar la información de un usuario

        """
        usuario = (
            self.db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
        )

        if not usuario:
            raise ValueError("Usuario no encontrado")

        if usuario_update.nombre is not None:
            usuario.nombre = usuario_update.nombre.strip().title()

        if usuario_update.apellido is not None:
            usuario.apellido = usuario_update.apellido.strip().title()

        if usuario_update.email is not None:
            if (
                self.db.query(Usuario)
                .filter(
                    Usuario.email == usuario_update.email,
                    Usuario.id_usuario != usuario_id,
                )
                .first()
            ):
                raise ValueError("El email ya está registrado por otro usuario")
            usuario.email = usuario_update.email.lower().strip()

        if usuario_update.id_rol is not None:
            usuario.id_rol = usuario_update.id_rol

        self.db.commit()
        self.db.refresh(usuario)

        return usuario

    def eliminar_usuario(self, usuario_id: int):
        """
        Elimina un usuario por su ID, eliminando primero sus asignaciones, transacciones y tarjetas asociadas.
        """
        usuario = (
            self.db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
        )

        if not usuario:
            raise ValueError("Usuario no encontrado")

        # Eliminar asignaciones relacionadas
        from Entities.asignacionT import AsignacionT

        self.db.query(AsignacionT).filter(AsignacionT.id_usuario == usuario_id).delete()
        self.db.commit()

        # Eliminar transacciones y tarjetas asociadas
        from Entities.tarjeta import Tarjeta
        from Entities.transaccion import Transaccion

        tarjetas = self.db.query(Tarjeta).filter(Tarjeta.id_usuario == usuario_id).all()
        for tarjeta in tarjetas:
            self.db.query(Transaccion).filter(
                Transaccion.numero_tarjeta == tarjeta.numero_tarjeta
            ).delete()
            self.db.delete(tarjeta)
        self.db.commit()

        self.db.delete(usuario)
        self.db.commit()
        return True

    def listar_usuarios(self):
        """
        Obtiene todos los usuarios

        """
        return self.db.query(Usuario).all()

    def mostrar_usuario(self, usuario_id: int):
        """
        Retorna la información completa de un usuario excepto la contraseña

        """
        usuario = (
            self.db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
        )

        if not usuario:
            raise ValueError("Usuario no encontrado")

        return {
            "ID": usuario.id_usuario,
            "Nombre": usuario.nombre,
            "Apellido": usuario.apellido,
            "Documento": usuario.documento,
            "Email": usuario.email,
            "Rol": usuario.id_rol,
            "Fecha Registro": usuario.fecha_registro.strftime("%Y-%m-%d %H:%M:%S"),
            "Fecha Actualización": usuario.fecha_actualizar.strftime(
                "%Y-%m-%d %H:%M:%S"
            ),
        }
