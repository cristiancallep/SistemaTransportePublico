from datetime import datetime

import bcrypt
from database import SessionLocal
from Entities import Rol
from Entities import Usuario

def seed_roles():
    """Seeder para la tabla Rol"""
    db = SessionLocal()
    
    try:
        if db.query(Rol).count() > 0:
            print("Roles ya existen, saltando seeder...")
            return
            
        print("Creando roles por defecto...")
        
        roles_default = [
            Rol(
                id_rol=1,
                nombre="Administrador",
            ),
            Rol(
                id_rol=2,
                nombre="Cliente",
            )
        ]
        
        for rol in roles_default:
            db.add(rol)
        
        db.commit()
    except Exception as e:
        db.rollback()
        print(f" Error seedeando roles: {e}")
    finally:
        db.close()


def seed_usuarios():
    """Seeder para la tabla Usuario"""
    db = SessionLocal()

    hash_contrasenaA = bcrypt.hashpw("admin123".encode('utf-8'),bcrypt.gensalt()).decode('utf-8')
    hash_contrasenaU = bcrypt.hashpw("cliente123".encode('utf-8'),bcrypt.gensalt()).decode('utf-8')
    try:
        # Verificar si ya existen usuarios
        if db.query(Usuario).count() > 0:
            print("Usuarios ya existen, saltando seeder...")
            return
            
        print("Creando usuarios por defecto...")
        
        # Obtener roles existentes
        rol_admin = db.query(Rol).filter(Rol.nombre == "Administrador").first()
        rol_cliente = db.query(Rol).filter(Rol.nombre == "Cliente").first()
        
        # Validar que existan los roles
        if not all([rol_admin, rol_cliente]):
            print("Error: Primero debes ejecutar seed_roles()")
            return
            
        
        usuarios_default = [
            Usuario(
                id_rol=rol_admin.id_rol,
                nombre="Tomas",
                apellido="Alvarez",
                documento="12345678",
                email="tomas@sistema.com",
                contrasena=hash_contrasenaA,
            ),
            Usuario(
                id_rol=rol_admin.id_rol,
                nombre="Cristian",
                apellido="Calle",
                documento="23456789",
                email="cristian@sistema.com",
                contrasena=hash_contrasenaA,
            ),
            Usuario(
                id_rol=rol_admin.id_rol,
                nombre="Emely",
                apellido="Loaiza",
                documento="1054864253",
                email="emely@sistema.com",
                contrasena=hash_contrasenaA,
            ),
            Usuario(
                id_rol=rol_cliente.id_rol,
                nombre="Juan",
                apellido="Pérez",
                documento="11223344",
                email="juan@email.com",
                contrasena=hash_contrasenaU,
            )
        ]
        
        # Insertar usuarios en la BD
        for usuario in usuarios_default:
            db.add(usuario)
        
        db.commit()
        
    except Exception as e:
        db.rollback()
        print(f"Error seedeando usuarios: {e}")
    finally:
        db.close()


def run_rol_usuario_seeders():
    """Ejecutar seeders de Rol y Usuario en orden correcto"""
    print("Iniciando seeders de Rol y Usuario...")
    print("="*50)
    
    seed_roles()
    seed_usuarios()
    
    print("="*50)
    print("Seeders de Rol y Usuario completados")
