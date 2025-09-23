"""
Menús de usuario y admin para el sistema de transporte público
"""

import Utilities.logica as logica
from Crud.empleado_crud import EmpleadoCRUD
from Crud.transporte_crud import TransporteCRUD
from Crud.ruta_crud import RutaCRUD
from Crud.asignacionT_crud import AsignacionTCRUD


def menuUsuario():
    logica.limpiar_consola()
    while logica.usuario_actual is not None:
        print(f"\n¡Bienvenido Cliente {logica.usuario_actual.nombre}!")

        opcion = input(
            "Seleccione una opción:\n"
            "1. Crear Tarjeta\n"
            "2. Consultar saldo\n"
            "3. Recargar tarjeta\n"
            "4. Comprar tiquete\n"
            "5. Ver mis tiquetes y transportes asignados\n"
            "6. Salir\n"
        ).strip()
        if opcion not in {"1", "2", "3", "4", "5", "6", "9"}:
            print("Opción inválida. Intente de nuevo.")
            continue
        if opcion == "1":
            documento = input("Ingrese su documento: ").strip()
            logica.crear_tarjeta(documento=documento)
        elif opcion == "2":
            documento = input("Ingrese su documento: ").strip()
            logica.consultar_saldo(documento=documento)
        elif opcion == "3":
            documento = input("Ingrese su documento: ").strip()
            while True:
                monto_str = input("Ingrese el monto a recargar: ").strip()
                try:
                    monto = float(monto_str)
                    if monto <= 0:
                        print("El monto debe ser mayor a cero.")
                        continue
                    break
                except ValueError:
                    print("Monto inválido. Ingrese un número válido.")
            logica.recargar_tarjeta(documento=documento, monto=monto)
        elif opcion == "4":
            print(
                "Tipos de transporte disponibles: 1. Bus 2. Metro 3. Tranvía 4. Metrocable"
            )
            tipo_opciones = {
                "1": "Bus",
                "2": "Metro",
                "3": "Tranvía",
                "4": "Metrocable",
            }
            tipo = input("Seleccione el tipo de transporte: ").strip()
            tipo_texto = tipo_opciones.get(tipo, tipo)
            db_gen = logica.get_db()
            db = next(db_gen)
            transporte_crud = TransporteCRUD(db)
            ruta_crud = RutaCRUD(db)
            transportes = [
                t
                for t in transporte_crud.listar_transportes()
                if t.tipo.lower() == tipo_texto.lower()
            ]
            if not transportes:
                print("No hay transportes disponibles para ese tipo.")
                db_gen.close()
                continue
            print("Transportes disponibles:")
            for idx, t in enumerate(transportes):
                print(
                    f"{idx+1}. Placa: {t.placa}, Estado: {t.estado}, Capacidad: {t.capacidad}"
                )
            while True:
                t_idx_str = input("Seleccione el transporte: ").strip()
                if not t_idx_str.isdigit():
                    print("Debe ingresar un número válido.")
                    continue
                t_idx = int(t_idx_str) - 1
                if t_idx < 0 or t_idx >= len(transportes):
                    print("Índice fuera de rango. Intente de nuevo.")
                    continue
                transporte = transportes[t_idx]
                break
            rutas = ruta_crud.listar_rutas()
            print("Rutas disponibles:")
            for idx, r in enumerate(rutas):
                print(f"{idx+1}. {r.nombre} ({r.origen} -> {r.destino})")
            while True:
                r_idx_str = input("Seleccione la ruta: ").strip()
                if not r_idx_str.isdigit():
                    print("Debe ingresar un número válido.")
                    continue
                r_idx = int(r_idx_str) - 1
                if r_idx < 0 or r_idx >= len(rutas):
                    print("Índice fuera de rango. Intente de nuevo.")
                    continue
                ruta = rutas[r_idx]
                break
            # Descontar saldo de la tarjeta antes de asignar
            from Crud.tarjeta_crud import TarjetaCRUD
            from Entities.tarjeta import Tarjeta

            tarjeta_crud = TarjetaCRUD(db)
            tarjeta = (
                db.query(Tarjeta)
                .filter_by(id_usuario=logica.usuario_actual.id_usuario)
                .first()
            )
            valor_tiquete = 2500
            if not tarjeta:
                print(
                    "No tienes una tarjeta registrada. No se puede comprar el tiquete."
                )
                db_gen.close()
                continue
            if tarjeta.saldo < valor_tiquete:
                print(
                    f"Saldo insuficiente. Tu saldo es {tarjeta.saldo}, el valor del tiquete es {valor_tiquete}."
                )
                db_gen.close()
                continue
            # Asignar automáticamente un empleado disponible
            empleado_crud = EmpleadoCRUD(db)
            empleados = empleado_crud.listar_empleados()
            if not empleados:
                print(
                    "No hay empleados disponibles para asignar. No se puede completar la compra."
                )
                db_gen.close()
                continue
            import random

            empleado = random.choice(empleados)
            # Descontar saldo y guardar
            tarjeta.saldo -= valor_tiquete
            db.commit()
            # Registrar transacción de pago de tiquete
            from Crud.transacciones_crud import TransaccionCRUD

            transacciones_crud = TransaccionCRUD(db)
            transacciones_crud.registrar_transaccion(
                numero_tarjeta=tarjeta.numero_tarjeta,
                tipo_transaccion="Pago Tiquete",
                monto=-valor_tiquete,
            )
            from Entities.asignacionT import AsignacionTCreate

            asignacion_crud = AsignacionTCRUD(db)
            asignacion = AsignacionTCreate(
                id_usuario=logica.usuario_actual.id_usuario,
                id_empleado=empleado.id_empleado,
                id_transporte=transporte.id_transporte,
                id_ruta=ruta.id_ruta,
            )
            asignacion_crud.registrar_asignacion(asignacion)
            print(
                f"Tiquete comprado y transporte asignado correctamente. Empleado asignado: {empleado.nombre} {empleado.apellido}. Se descontaron {valor_tiquete} de tu tarjeta y se registró la transacción."
            )
            db_gen.close()
        elif opcion == "5":
            db_gen = logica.get_db()
            db = next(db_gen)
            asignacion_crud = AsignacionTCRUD(db)
            asignaciones = asignacion_crud.obtener_por_usuario(
                logica.usuario_actual.id_usuario
            )
            if not asignaciones:
                print("No tienes tiquetes ni transportes asignados.")
            else:
                for a in asignaciones:
                    print(f"Transporte: {a.id_transporte} | Ruta: {a.id_ruta}")
            db_gen.close()
        elif opcion == "6":
            print(
                f"{logica.usuario_actual.nombre} Gracias por usar el sistema de transporte."
            )
            break
        else:
            print("Opción inválida. Intente de nuevo.")


def menuAdmin():
    logica.limpiar_consola()
    while logica.usuario_actual is not None:
        print(f"\n--- BIENVENID@ ADMIN: {logica.usuario_actual.nombre} ---")
        print("1. Registrar Usuarios")
        print("2. Actualizar Usuarios")
        print("3. Eliminar Usuarios")
        print("4. Consultar Usuarios")
        print("5. Ver cambios")
        print("6. Registrar empleado")
        print("7. Actualizar empleado")
        print("8. Eliminar empleado")
        print("9. Consultar empleados")
        print("10. Agregar Ruta")
        print("11. Modificar Ruta")
        print("12. Agregar Linea")
        print("13. Agregar Transporte")
        print("14. Asignar transporte a usuario")
        print("15. Ver asignaciones y tiquetes")
        print("16. Salir")
        opcion = input("Seleccione una opción: ").strip()
        db_gen = logica.get_db()
        db = next(db_gen)
        if opcion == "1":
            logica.registrar(es_admin=True)
        elif opcion == "2":
            logica.admin_listar_usuarios()
            logica.actualizar_usuario_admin()
        elif opcion == "3":
            logica.admin_listar_usuarios()
            logica.eliminar_usuario_admin()
        elif opcion == "4":
            logica.admin_listar_usuarios()
        elif opcion == "5":
            logica.admin_listar_cambios()
        elif opcion == "6":
            nombre = input("Nombre del empleado: ").strip()
            apellido = input("Apellido del empleado: ").strip()
            documento = input("Documento: ").strip()
            email = input("Email: ").strip()
            rol = input("Rol del empleado: ").strip()
            empleado_crud = EmpleadoCRUD(db)
            from Entities.empleado import EmpleadoCreate

            nuevo = EmpleadoCreate(
                nombre=nombre,
                apellido=apellido,
                documento=documento,
                email=email,
                rol=rol,
            )
            empleado_crud.crear_empleado(nuevo)
            print("Empleado registrado correctamente.")
            if logica.usuario_actual:
                logica.agregar_auditoria_usuario(
                    "CREATE", "empleados", logica.usuario_actual
                )
        elif opcion == "7":
            # Actualizar empleado
            empleado_crud = EmpleadoCRUD(db)
            empleados = empleado_crud.listar_empleados()
            print("Empleados disponibles:")
            for idx, e in enumerate(empleados):
                print(
                    f"{idx+1}. {e.nombre} {e.apellido} | Documento: {e.documento} | Email: {e.email} | Rol: {e.rol} | Estado: {e.estado}"
                )
            while True:
                idx_str = input("Seleccione el empleado a actualizar: ").strip()
                if not idx_str.isdigit():
                    print("Debe ingresar un número válido.")
                    continue
                idx = int(idx_str) - 1
                if idx < 0 or idx >= len(empleados):
                    print("Índice fuera de rango. Intente de nuevo.")
                    continue
                empleado = empleados[idx]
                break
            from Entities.empleado import EmpleadoUpdate

            nombre = input("Nuevo nombre: ").strip()
            apellido = input("Nuevo apellido: ").strip()
            email = input("Nuevo email: ").strip()
            rol = input("Nuevo rol: ").strip()
            estado = input("Nuevo estado: ").strip()
            update = EmpleadoUpdate(
                nombre=nombre or None,
                apellido=apellido or None,
                email=email or None,
                rol=rol or None,
                estado=estado or None,
            )
            empleado_crud.actualizar_empleado(empleado.id_empleado, update)
            print("Empleado actualizado correctamente.")
            if logica.usuario_actual:
                logica.agregar_auditoria_usuario(
                    "UPDATE", "empleados", logica.usuario_actual
                )
        elif opcion == "8":
            # Eliminar empleado
            empleado_crud = EmpleadoCRUD(db)
            empleados = empleado_crud.listar_empleados()
            print("Empleados disponibles:")
            for idx, e in enumerate(empleados):
                print(
                    f"{idx+1}. {e.nombre} {e.apellido} | Documento: {e.documento} | Email: {e.email} | Rol: {e.rol} | Estado: {e.estado}"
                )
            while True:
                idx_str = input("Seleccione el empleado a eliminar: ").strip()
                if not idx_str.isdigit():
                    print("Debe ingresar un número válido.")
                    continue
                idx = int(idx_str) - 1
                if idx < 0 or idx >= len(empleados):
                    print("Índice fuera de rango. Intente de nuevo.")
                    continue
                empleado = empleados[idx]
                break
            empleado_crud.eliminar_empleado(empleado.id_empleado)
            print("Empleado eliminado correctamente.")
            if logica.usuario_actual:
                logica.agregar_auditoria_usuario(
                    "DELETE", "empleados", logica.usuario_actual
                )
        elif opcion == "9":
            empleado_crud = EmpleadoCRUD(db)
            empleados = empleado_crud.listar_empleados()
            for e in empleados:
                print(
                    f"ID: {e.id_empleado} | Nombre: {e.nombre} {e.apellido} | Documento: {e.documento} | Email: {e.email} | Rol: {e.rol} | Estado: {e.estado}"
                )
        elif opcion == "10":
            from Entities.linea import Linea

            lineas = db.query(Linea).all()
            if not lineas:
                print(
                    "No hay líneas registradas. Debe crear una línea antes de registrar una ruta."
                )
                return
            print("Líneas disponibles:")
            for idx, l in enumerate(lineas):
                print(f"{idx+1}. {l.nombre} - {l.descripcion}")
            while True:
                l_idx_str = input("Seleccione la línea para la ruta: ").strip()
                if not l_idx_str.isdigit():
                    print("Debe ingresar un número válido.")
                    continue
                l_idx = int(l_idx_str) - 1
                if l_idx < 0 or l_idx >= len(lineas):
                    print("Índice fuera de rango. Intente de nuevo.")
                    continue
                linea = lineas[l_idx]
                break
            nombre_ruta = input("Ingrese el nombre de la nueva ruta: ").strip()
            origen = input("Ingrese el origen de la ruta: ").strip()
            destino = input("Ingrese el destino de la ruta: ").strip()
            duracion = float(
                input("Ingrese la duración estimada (en minutos): ").strip()
            )
            logica.generar_ruta(
                nombre_ruta, origen, destino, duracion, id_linea=linea.id_linea
            )
        elif opcion == "11":
            ruta_crud = RutaCRUD(db)
            rutas = ruta_crud.listar_rutas()
            print("Rutas disponibles:")
            for idx, r in enumerate(rutas):
                print(
                    f"{idx+1}. {r.nombre} ({r.origen}->{r.destino}) | Duración: {r.duracion_estimada} min"
                )
            while True:
                idx_str = input("Seleccione la ruta a modificar: ").strip()
                if not idx_str.isdigit():
                    print("Debe ingresar un número válido.")
                    continue
                idx = int(idx_str) - 1
                if idx < 0 or idx >= len(rutas):
                    print("Índice fuera de rango. Intente de nuevo.")
                    continue
                ruta = rutas[idx]
                break
            nombre_ruta = input("Nuevo nombre de la ruta: ").strip()
            origen = input("Nuevo origen: ").strip()
            destino = input("Nuevo destino: ").strip()
            duracion = float(input("Nueva duración estimada (en minutos): ").strip())
            logica.modificar_ruta(ruta.id_ruta, nombre_ruta, origen, destino, duracion)
        elif opcion == "12":
            nombre = input("Ingrese el nombre de la nueva linea: ").strip()
            descripcion = input("Ingrese la descripcion de la linea: ").strip()
            logica.generar_linea(nombre, descripcion)
        elif opcion == "13":
            tipo = input("Tipo de transporte: ").strip()
            placa = input("Placa: ").strip()
            capacidad = int(input("Capacidad: ").strip())
            # Mostrar líneas disponibles
            from Crud.linea_crud import LineaCRUD

            linea_crud = LineaCRUD(db)
            lineas = linea_crud.listar_lineas()
            print("Líneas disponibles:")
            for idx, l in enumerate(lineas):
                print(f"{idx+1}. {l.nombre} ({l.descripcion})")
            while True:
                l_idx_str = input("Seleccione la línea: ").strip()
                if not l_idx_str.isdigit():
                    print("Debe ingresar un número válido.")
                    continue
                l_idx = int(l_idx_str) - 1
                if l_idx < 0 or l_idx >= len(lineas):
                    print("Índice fuera de rango. Intente de nuevo.")
                    continue
                id_linea = lineas[l_idx].id_linea
                break
            transporte_crud = TransporteCRUD(db)
            from Entities.transporte import TransporteCreate

            nuevo = TransporteCreate(
                tipo=tipo, placa=placa, capacidad=capacidad, id_linea=id_linea
            )
            transporte_crud.registrar_transporte(nuevo)
            print("Transporte registrado correctamente.")
        elif opcion == "14":
            # Mostrar usuarios
            from Crud.usuario_crud import UsuarioCRUD

            usuario_crud = UsuarioCRUD(db)
            usuarios = usuario_crud.listar_usuarios()
            print("Usuarios disponibles:")
            for idx, u in enumerate(usuarios):
                print(f"{idx+1}. {u.nombre} {u.apellido} | UUID: {u.id_usuario}")
            while True:
                u_idx_str = input("Seleccione el usuario: ").strip()
                if not u_idx_str.isdigit():
                    print("Debe ingresar un número válido.")
                    continue
                u_idx = int(u_idx_str) - 1
                if u_idx < 0 or u_idx >= len(usuarios):
                    print("Índice fuera de rango. Intente de nuevo.")
                    continue
                id_usuario = usuarios[u_idx].id_usuario
                break
            # Mostrar transportes
            transporte_crud = TransporteCRUD(db)
            transportes = transporte_crud.listar_transportes()
            print("Transportes disponibles:")
            for idx, t in enumerate(transportes):
                print(f"{idx+1}. {t.tipo} | Placa: {t.placa} | UUID: {t.id_transporte}")
            t_idx = int(input("Seleccione el transporte: ").strip()) - 1
            id_transporte = transportes[t_idx].id_transporte
            # Mostrar rutas
            ruta_crud = RutaCRUD(db)
            rutas = ruta_crud.listar_rutas()
            print("Rutas disponibles:")
            for idx, r in enumerate(rutas):
                print(
                    f"{idx+1}. {r.nombre} ({r.origen}->{r.destino}) | UUID: {r.id_ruta}"
                )
            r_idx = int(input("Seleccione la ruta: ").strip()) - 1
            id_ruta = rutas[r_idx].id_ruta
            asignacion_crud = AsignacionTCRUD(db)
            from Entities.asignacionT import AsignacionTCreate

            # Mostrar empleados
            empleado_crud = EmpleadoCRUD(db)
            empleados = empleado_crud.listar_empleados()
            print("Empleados disponibles:")
            for idx, e in enumerate(empleados):
                print(f"{idx+1}. {e.nombre} {e.apellido} | UUID: {e.id_empleado}")
            while True:
                e_idx_str = input("Seleccione el empleado: ").strip()
                if not e_idx_str.isdigit():
                    print("Debe ingresar un número válido.")
                    continue
                e_idx = int(e_idx_str) - 1
                if e_idx < 0 or e_idx >= len(empleados):
                    print("Índice fuera de rango. Intente de nuevo.")
                    continue
                id_empleado = empleados[e_idx].id_empleado
                break
            asignacion = AsignacionTCreate(
                id_usuario=id_usuario,
                id_empleado=id_empleado,
                id_transporte=id_transporte,
                id_ruta=id_ruta,
            )
            asignacion_crud.registrar_asignacion(asignacion)
            print("Transporte asignado correctamente al usuario.")
        elif opcion == "15":
            asignacion_crud = AsignacionTCRUD(db)
            asignaciones = asignacion_crud.listar_asignaciones()
            from Entities.usuario import Usuario
            from Entities.empleado import Empleado
            from Entities.transporte import Transporte
            from Entities.ruta import Ruta

            if not asignaciones:
                print("No hay asignaciones registradas.")
            else:
                print("\n=== LISTADO DE ASIGNACIONES ===")
                for idx, a in enumerate(asignaciones, 1):
                    usuario = (
                        db.query(Usuario).filter_by(id_usuario=a.id_usuario).first()
                    )
                    empleado = (
                        db.query(Empleado).filter_by(id_empleado=a.id_empleado).first()
                    )
                    transporte = (
                        db.query(Transporte)
                        .filter_by(id_transporte=a.id_transporte)
                        .first()
                    )
                    ruta = db.query(Ruta).filter_by(id_ruta=a.id_ruta).first()
                    nombre_usuario = (
                        f"{usuario.nombre} {usuario.apellido}"
                        if usuario
                        else str(a.id_usuario)
                    )
                    nombre_empleado = (
                        f"{empleado.nombre} {empleado.apellido}"
                        if empleado
                        else str(a.id_empleado)
                    )
                    ref_transporte = (
                        f"{transporte.tipo} - {transporte.placa}"
                        if transporte
                        else str(a.id_transporte)
                    )
                    ref_ruta = (
                        f"{ruta.nombre} ({ruta.origen}->{ruta.destino})"
                        if ruta
                        else str(a.id_ruta)
                    )
                    print(f"\nAsignación #{idx}")
                    print(f"  Usuario:    {nombre_usuario}")
                    print(f"  Empleado:   {nombre_empleado}")
                    print(f"  Transporte: {ref_transporte}")
                    print(f"  Ruta:       {ref_ruta}")
                print("\n==============================\n")
        elif opcion == "16":
            print(
                f"{logica.usuario_actual.nombre} Gracias por usar el sistema de transporte."
            )
            db_gen.close()
            break
        db_gen.close()
