# Sistema de Transporte Público

- Este proyecto es un sistema para la gestión de transporte público. Incluye manejo de usuarios, auditorías, rutas, tarjetas, transportes, entre otros. Está desarrollado en ***Python***, utiliza ***SQLAlchemy*** como ORM para la gestión de la base de datos, y cuenta con una API desarrollada con FastAPI para exponer los servicios del sistema.

## Descripción
Se implementó una ***API RESTful usando FastAPI***, que permite la interacción con el sistema mediante peticiones HTTP.
Esta API incluye controladores (endpoints) para realizar operaciones CRUD sobre las principales entidades del sistema: usuarios, rutas, tarjetas, transportes, empleados, etc.

- Framework: FastAPI
- Validaciones: realizadas con Pydantic, garantizando la integridad de los datos enviados y recibidos.
- Respuestas personalizadas en formato JSON para errores comunes (404, 400, 422, 500).
- Cada entidad cuenta con su propio router y esquema, lo que facilita la escalabilidad y el mantenimiento del proyecto.
---

## Estructura del Proyecto

```
SistemaTransportePublico/
├── api/
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── asignacion.py
│   │   ├── auditoria.py
│   │   ├── empleado.py
│   │   ├── linea.py
│   │   ├── parada.py
│   │   ├── ruta.py
│   │   ├── tarjeta.py
│   │   ├── transaccion.py
│   │   ├── transporte.py
│   │   ├── usuarios.py
│   │   ├── dependencies.py
│   │   └── exception_handlers.py
│   ├── config/
│   │   ├── pyproject.toml
│   │   └── requirements.txt
│
├── Crud/
│   ├── __init__.py
│   ├── asignacionT_crud.py
│   ├── auditoria_crud.py
│   ├── empleado_crud.py
│   ├── linea_crud.py
│   ├── parada_crud.py
│   ├── ruta_crud.py
│   ├── tarjeta_crud.py
│   ├── transacciones_crud.py
│   ├── transporte_crud.py
│   └── usuario_crud.py
│
├── database/
├── Entities/
├── .gitignore
├── main.py
└── README.md
```

Estructura  de `sistema-transporte-frontend/`:

```
sistema-transporte-frontend/
├── angular.json
├── package.json
├── package-lock.json
├── public/
└── src/
  ├── index.html
  ├── main.ts
  ├── styles.scss
  ├── environments/
  │   ├── environment.ts
  │   └── environment.prod.ts
  └── app/
    ├── app.config.ts
    ├── app.html
    ├── app.routes.ts
    ├── app.spec.ts
    ├── app.ts
    ├── core/
    │   ├── guards/
    │   │   └── auth.guard.ts
    │   ├── interceptors/
    │   │   └── auth.interceptor.ts
    │   └── services/
    │       ├── api.service.ts
    │       └── auth.service.ts
    ├── features/
    │   ├── auth/
    │   ├── dashboard/
    │   ├── empleados/
    │   │   ├── empleado-form.component.ts
    │   │   └── empleados-list.component.ts
    │   ├── paradas/
    │   ├── profile/
    │   ├── reportes/
    │   ├── settings/
    │   ├── tarjetas/
    │   ├── transacciones/
    │   ├── transportes/
    │   │   ├── linea-form.component.ts
    │   │   ├── lineas-list.component.ts
    │   │   └── transporte-form.component.ts
    │   └── usuarios/
    └── shared/
      ├── components/
      └── models/
```
---

## Instalación

Clona el repositorio y sitúate en la carpeta del proyecto:

```powershell
git clone https://github.com/cristiancallep/SistemaTransportePublico.git
cd SistemaTransportePublico
```

### Backend (Python / FastAPI)

1. Crear y activar un entorno virtual (recomendado):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Instalar dependencias Python (el archivo está en `config/requirements.txt`):

```powershell
pip install -r .\config\requirements.txt
```

3. Añadir archivo de entorno `.env` en la raíz del proyecto con las variables de conexión. Ejemplo mínimo:

```text
# .env (ejemplo)
DATABASE_URL=postgresql://user:password@localhost:5432/SistemaTransportePublico
# o alternativamente definir DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD
```

4. (Opcional) Crear las tablas en la base de datos desde Python:

```powershell
python -c "from database.config import create_tables; create_tables()"
```

5. Ejecutar la API:

```powershell
python .\main.py
```

Nota: `database/config.py` usa `DATABASE_URL` del `.env` o las variables `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`.

### Frontend (Angular)

El frontend se encuentra en `sistema-transporte-frontend/` y es una aplicación Angular.

1. Instalar dependencias y ejecutar (desde la carpeta del frontend):

```powershell
cd .\sistema-transporte-frontend
npm install
npm start
```

Esto inicia la aplicación con `ng serve` (puerto por defecto 4200).

---

### Cómo funciona el frontend

El frontend es una aplicación SPA desarrollada con Angular ubicada en `sistema-transporte-frontend/` (código en `src/app/`). Principales conceptos:

- Estructura: la carpeta `src/app/` está organizada en `core/` (guards, interceptors, servicios compartidos), `features/` (módulos/funcionalidades por área: auth, empleados, transacciones, transportes, etc.) y `shared/` (componentes y modelos reutilizables).

- Ruteo: `app.routes.ts` define las rutas de la aplicación. Los guards en `core/guards/` protegen rutas que requieren autenticación.

- Comunicación con el backend: `core/services/api.service.ts` (y `auth.service.ts`) usan `HttpClient` para realizar peticiones HTTP a la API. `core/interceptors/auth.interceptor.ts` añade el token JWT a las cabeceras de las peticiones cuando el usuario está autenticado.

- Entornos: las URLs base y otras configuraciones por entorno están en `src/environments/environment.ts` y `environment.prod.ts`. Para conectar con la API ajusta `environment.apiUrl` a la URL de tu backend (por ejemplo `http://localhost:8000`).

- Desarrollo y despliegue:
  - Desarrollo local: desde `sistema-transporte-frontend/` ejecuta `npm install` y `npm start` (`ng serve`).
  - Build de producción: `npm run build` (genera los archivos estáticos en `dist/`), que puedes servir con cualquier servidor estático o integrarlos en el backend.

- CORS: durante el desarrollo asegúrate de que la API (FastAPI) permita peticiones desde el origen del frontend (por ejemplo `http://localhost:4200`). En FastAPI se usa `CORSMiddleware` para configurar orígenes permitidos.

Este diseño separa claramente la lógica de presentación (Angular) de la lógica de negocio y API (FastAPI), facilitando el desarrollo independiente y pruebas.

## Clases Principales
El sistema está compuesto por diferentes entidades que representan los elementos.
Cada clase corresponde a una tabla/modelo en la base de datos y está definida dentro de la carpeta 'Entities/'.

### Descripcion de Entidades

- **asignacionT.py** → Representa la asignación de transportes a rutas, empleados u otros elementos del sistema.  
- **auditoria.py** → Registra eventos importantes del sistema para control y seguimiento.  
- **empleado.py** → Contiene la información de los empleados del sistema de transporte.  
- **linea.py** → Define las líneas de transporte disponibles (ej: Línea 1, Línea 2).  
- **parada.py** → Representa las paradas dentro de las rutas.  
- **roles.py** → Define los diferentes roles de usuario dentro del sistema (ej: administrador, cliente).  
- **ruta.py** → Modela las rutas que conectan paradas y líneas.  
- **tarjeta.py** → Representa las tarjetas de transporte usadas por los usuarios.  
- **transaccion.py** → Maneja los registros de recargas, pagos y movimientos de las tarjetas.  
- **transporte.py** → Define los diferentes medios de transporte (bus, metro, etc.).  
- **usuario.py** → Representa a los usuarios del sistema (clientes, administradores).  

---
Cada una de estas entidades está asociada con su respectivo módulo en la carpeta `Crud/`, que se encarga de las operaciones **CRUD (Crear, Leer, Actualizar, Eliminar)** sobre ellas.
---

## Lógica de Negocio - Sistema de Transporte

### **1. Descripción General**

El sistema de transporte permite a los usuarios interactuar digitalmente con los servicios de transporte público (bus, metro, tranvía, metrocable) a través de funcionalidades como compra de tiquetes, creación y recarga de tarjetas, y visualización de rutas.
Los administradores tienen control total sobre la gestión de datos, pudiendo crear, editar y eliminar información relacionada con usuarios, rutas, líneas, paradas y tarjetas.

### **2. Lógica de negocio para usuarios**
**2.1 Autenticación y registro**

- Registro de usuario:  
  - El usuario debe proporcionar información básica como nombre, documento, correo electrónico y contraseña.

  - Validar que el correo y documento no estén previamente registrados.

  - Asignar un identificador único al usuario y crear su perfil inicial.

  - Permitir la creación automática de una tarjeta asociada al usuario si lo selecciona durante el registro.

- Inicio de sesión:

  - Validar credenciales ingresadas (correo y contraseña).

  - En caso de datos correctos, generar una sesión activa.

  - Si el usuario ingresa credenciales incorrectas tres veces seguidas, bloquear el acceso temporalmente por seguridad.

**2.2 Gestión de tarjetas**

- Creación de tarjeta:  
  - El usuario puede generar una tarjeta de transporte única vinculada a su cuenta.

  - Cada tarjeta tiene un número único y saldo inicial en $0.

  - No se puede crear más de una tarjeta activa por usuario.

- Recarga de tarjeta:
  - Validar que el monto ingresado sea mayor a $0 y dentro del límite permitido (ej. máximo $200.000).

  - Sumar el valor recargado al saldo actual de la tarjeta.

  - Generar un registro de la transacción en el historial.

- Consulta de saldo:
  -El usuario debe ingresar el documento asociado a la tarjeta que quiere consultar el saldo.
  - Si el usuario ingresa un documento inexistente el sistema le notifica.
  -Se puede consultar el saldo las veces que se consideren necesarias.

**2.3 Compra de tiquetes**

- El usuario selecciona:
  - Tipo de transporte: bus, metro, tranvía o metrocable.

  - Ruta disponible dentro de la línea seleccionada.

  - Cantidad de tiquetes a comprar.

- Validar que:
  - El saldo de la tarjeta sea suficiente para la compra.

  - La cantidad de tiquetes no supere el límite establecido (ej. máximo 10 por transacción).

  - Descontar el valor total de la compra del saldo de la tarjeta.

  - Generar un comprobante digital de la compra.

- Consulta de tiquetes o transportes:
  - El sistema utiliza la sesión actual del usuario buscar sus asignaciones.
  - Si no tiene asignaciones el sistema le notifica.
  - Si tiene, el sistema muestra el transporte y la ruta que sigue.

**2.4 Consulta de rutas y líneas**

- El usuario puede visualizar:

  - Todas las líneas de transporte disponibles.

  - Las rutas asociadas a cada línea.

  - Detalle de paradas en cada ruta.

### **3. Lógica de negocio para administrador**

**3.1 Gestión completa (CRUD)**
El administrador tiene acceso completo para administrar todas las entidades del sistema.

- Usuarios:

  - Crear nuevos usuarios o administradores.

  - Editar información personal y estado (activo/inactivo).

  - Eliminar usuarios inactivos o duplicados.

- Empleados:
  - Crear/Registrar un nuevo empleado.

  - Actualizar la información de un empleado.

  - Eliminar un empleado.

  - Consultar todos los empleados.

- Tarjetas:

  - Crear tarjetas asociadas a un usuario.

  - Modificar saldo en casos especiales (reembolsos, ajustes).

  - Bloquear o reactivar tarjetas en caso de pérdida.

- Líneas y rutas:

  - Crear nuevas líneas de transporte (ej. Línea A - Metro, Línea B - Bus).

  - Registrar rutas y asignarlas a una línea específica.

  - Activar o desactivar rutas según disponibilidad.

  - Editar información de paradas (nombre, ubicación).

- Asignaciones:

  - Relacionar rutas con líneas y definir horarios.

  - Actualizar la asignación en caso de cambios en el servicio.

  - Puede ver todas las asignaciones existentes en el sistema

  - Asignar manualmente un transporte a un usuario


**3.2 Control y monitoreo**

- Generar reportes sobre:

  - Ventas de tiquetes.

  - Saldo total recargado.

  - Uso de rutas y líneas más concurridas.

  - Monitorear el estado de usuarios y tarjetas.

**4. Reglas generales de negocio**

Integridad de datos:

Cada entidad debe tener identificadores únicos.

No se permiten registros duplicados.

Restricciones en recargas:

Valor mínimo: $1.000.

Valor máximo por recarga: $200.000.

Compra de tiquetes:

Solo se puede comprar si el saldo es suficiente.

Límite máximo de tiquetes por compra: 10.

Administradores:

Solo usuarios con rol de administrador pueden acceder a la gestión de datos críticos.

Seguridad:

Contraseñas deben almacenarse encriptadas.

Control de sesiones con cierre automático por inactividad.

**5. Flujo resumido del sistema**
Usuario:

Registrarse o iniciar sesión.

Crear una tarjeta (opcional si no se generó en el registro).

Recargar saldo en la tarjeta.

Consultar rutas y líneas disponibles.

Comprar tiquetes con el saldo disponible.

Recibir comprobante digital.

Administrador:

Iniciar sesión como administrador.

Gestionar entidades (usuarios, tarjetas, líneas, rutas, paradas, asignaciones).


## 👨‍💻 Créditos

Proyecto desarrollado por:  
- Cristian Calle
- Tomás Álvarez
- Emely Loaiza Ocampo

