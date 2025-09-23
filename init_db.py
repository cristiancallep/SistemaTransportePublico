"""
Script para inicializar la base de datos con valores iniciales (roles, líneas, etc.)
Ejecuta este archivo una vez para poblar las tablas principales.
"""

# Importa todos los modelos para asegurar que las relaciones estén definidas
from Entities.usuario import Usuario
from Entities.roles import Rol
from Entities.linea import Linea
from Entities.transporte import Transporte
from Entities.tarjeta import Tarjeta
from Entities.transaccion import Transaccion
from Entities.ruta import Ruta
from Entities.empleado import Empleado
from Entities.auditoria import Auditoria
from Entities.asignacionT import AsignacionT
from Entities.parada import Parada

from database import get_db, create_tables
from sqlalchemy.dialects.postgresql import UUID
import uuid

# Inicializa las tablas

print("Creando tablas...")
create_tables()
print("Tablas creadas.")
db_gen = get_db()
db = next(db_gen)

try:
    # Insertar roles
    print("Insertando roles...")
    roles = [
        Rol(id_rol=1, nombre="Administrador"),
        Rol(id_rol=2, nombre="Cliente"),
    ]
    for rol in roles:
        db.merge(rol)
    db.commit()
    print("Roles insertados.")

    # Insertar empleados
    print("Insertando empleados...")
    empleados = [
        Empleado(
            id_empleado=uuid.uuid4(),
            nombre="Juan",
            apellido="Gómez",
            documento="1001",
            email="juan@metro.com",
            rol="Operador",
            estado="Activo",
        ),
        Empleado(
            id_empleado=uuid.uuid4(),
            nombre="Ana",
            apellido="López",
            documento="1002",
            email="ana@metro.com",
            rol="Supervisor",
            estado="Activo",
        ),
    ]
    for empleado in empleados:
        db.merge(empleado)
    db.commit()
    print("Empleados insertados.")

    # Insertar líneas
    print("Insertando líneas...")
    lineas = [
        Linea(
            id_linea=uuid.uuid4(), nombre="Línea A", descripcion="Niquía - La Estrella"
        ),
        Linea(
            id_linea=uuid.uuid4(), nombre="Línea B", descripcion="San Javier - Estrella"
        ),
        Linea(id_linea=uuid.uuid4(), nombre="Línea C", descripcion="Tranvía Ayacucho"),
        Linea(
            id_linea=uuid.uuid4(),
            nombre="Línea D",
            descripcion="Metrocable Santo Domingo",
        ),
        Linea(
            id_linea=uuid.uuid4(), nombre="Línea E", descripcion="Metrocable La Sierra"
        ),
    ]
    for linea in lineas:
        db.merge(linea)
    db.commit()
    print("Líneas insertadas.")

    # Insertar rutas
    print("Insertando rutas...")
    rutas = [
        Ruta(
            id_ruta=uuid.uuid4(),
            id_linea=lineas[0].id_linea,
            nombre="Ruta Norte",
            origen="Niquía",
            destino="La Estrella",
            duracion_estimada=40,
        ),
        Ruta(
            id_ruta=uuid.uuid4(),
            id_linea=lineas[1].id_linea,
            nombre="Ruta Oeste",
            origen="San Javier",
            destino="Estrella",
            duracion_estimada=35,
        ),
    ]
    for ruta in rutas:
        db.merge(ruta)
    db.commit()
    print("Rutas insertadas.")

    # Insertar paradas
    print("Insertando paradas...")
    from Entities.parada import Parada

    paradas = [
        Parada(
            id_parada=uuid.uuid4(),
            nombre="Niquía",
            direccion="Calle 1",
            coordenadas="6.338, -75.558",
            estado="Activa",
        ),
        Parada(
            id_parada=uuid.uuid4(),
            nombre="La Estrella",
            direccion="Calle 2",
            coordenadas="6.175, -75.642",
            estado="Activa",
        ),
    ]
    for parada in paradas:
        db.merge(parada)
    db.commit()
    print("Paradas insertadas.")

    # Insertar transportes
    print("Insertando transportes...")
    transportes = [
        Transporte(
            id_transporte=uuid.uuid4(),
            tipo="Metro",
            placa="MTR001",
            capacidad=1000,
            estado="Activo",
            id_linea=lineas[0].id_linea,
        ),
        Transporte(
            id_transporte=uuid.uuid4(),
            tipo="Metro",
            placa="MTR002",
            capacidad=1000,
            estado="Activo",
            id_linea=lineas[0].id_linea,
        ),
        Transporte(
            id_transporte=uuid.uuid4(),
            tipo="Tranvía",
            placa="TRV001",
            capacidad=300,
            estado="Activo",
            id_linea=lineas[2].id_linea,
        ),
        Transporte(
            id_transporte=uuid.uuid4(),
            tipo="Metrocable",
            placa="MCB001",
            capacidad=50,
            estado="Activo",
            id_linea=lineas[3].id_linea,
        ),
        Transporte(
            id_transporte=uuid.uuid4(),
            tipo="Metrocable",
            placa="MCB002",
            capacidad=50,
            estado="Activo",
            id_linea=lineas[4].id_linea,
        ),
    ]
    for transporte in transportes:
        db.merge(transporte)
    db.commit()
    print("Transportes insertados.")

    # Insertar usuarios
    print("Insertando usuarios...")
    usuarios = [
        Usuario(
            id_usuario=uuid.uuid4(),
            id_rol=1,
            nombre="Cristian",
            apellido="Calle",
            documento="1152717416",
            email="crisscp99@gmail.com",
            contrasena="12345678",
            fecha_registro=None,
            fecha_actualizar=None,
        ),
        Usuario(
            id_usuario=uuid.uuid4(),
            id_rol=2,
            nombre="Laura",
            apellido="Martínez",
            documento="1152717417",
            email="laura@gmail.com",
            contrasena="12345678",
            fecha_registro=None,
            fecha_actualizar=None,
        ),
    ]
    for usuario in usuarios:
        db.merge(usuario)
    db.commit()
    print("Usuarios insertados.")

    # Insertar tarjetas
    print("Insertando tarjetas...")
    tarjetas = [
        Tarjeta(
            id_tarjeta=1,
            id_usuario=usuarios[0].id_usuario,
            tipo_tarjeta="Frecuente",
            numero_tarjeta="1234567890123456",
            estado="Activa",
            saldo=5000.0,
            fecha_ultima_recarga=None,
        ),
        Tarjeta(
            id_tarjeta=2,
            id_usuario=usuarios[1].id_usuario,
            tipo_tarjeta="Estudiante",
            numero_tarjeta="6543210987654321",
            estado="Activa",
            saldo=3000.0,
            fecha_ultima_recarga=None,
        ),
    ]
    for tarjeta in tarjetas:
        db.merge(tarjeta)
    db.commit()
    print("Tarjetas insertadas.")

    # Insertar transacciones
    print("Insertando transacciones...")
    transacciones = [
        Transaccion(
            numero_tarjeta=tarjetas[0].numero_tarjeta,
            tipo_transaccion="Recarga",
            monto=5000.0,
            fecha_transaccion=None,
        ),
        Transaccion(
            numero_tarjeta=tarjetas[1].numero_tarjeta,
            tipo_transaccion="Recarga",
            monto=3000.0,
            fecha_transaccion=None,
        ),
    ]
    for transaccion in transacciones:
        db.merge(transaccion)
    db.commit()
    print("Transacciones insertadas.")

    # Insertar auditorías
    print("Insertando auditorías...")
    auditorias = [
        Auditoria(
            id_auditoria=uuid.uuid4(),
            id_usuario=usuarios[0].id_usuario,
            tabla_afectada="usuarios",
            accion="CREATE",
            descripcion="Usuario creado",
            fecha=None,
        ),
        Auditoria(
            id_auditoria=uuid.uuid4(),
            id_usuario=usuarios[1].id_usuario,
            tabla_afectada="usuarios",
            accion="CREATE",
            descripcion="Usuario creado",
            fecha=None,
        ),
    ]
    for auditoria in auditorias:
        db.merge(auditoria)
    db.commit()
    print("Auditorías insertadas.")

    # Insertar asignaciones
    print("Insertando asignaciones...")
    asignaciones = [
        AsignacionT(
            id_asignacion=uuid.uuid4(),
            id_usuario=usuarios[0].id_usuario,
            id_empleado=empleados[0].id_empleado,
            id_transporte=transportes[0].id_transporte,
            id_ruta=rutas[0].id_ruta,
            fecha_asignacion=None,
        ),
        AsignacionT(
            id_asignacion=uuid.uuid4(),
            id_usuario=usuarios[1].id_usuario,
            id_empleado=empleados[1].id_empleado,
            id_transporte=transportes[2].id_transporte,
            id_ruta=rutas[1].id_ruta,
            fecha_asignacion=None,
        ),
    ]
    for asignacion in asignaciones:
        db.merge(asignacion)
    db.commit()
    print("Asignaciones insertadas.")

except Exception as e:
    print(f"Error al inicializar la base de datos: {e}")
    db.rollback()
finally:
    db_gen.close()
    print("Inicialización finalizada.")
