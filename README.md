# Sistema de Transporte Público

- Este proyecto es un sistema para la gestión de transporte público. Incluye manejo de usuarios, auditorías, rutas, tarjetas, transportes, entre otros. Está desarrollado en **Python** y utiliza **SQLAlchemy** como ORM para la gestión de la base de datos.
---

## Estructura del Proyecto

```
SISTEMATRANSPORTEPUBLICO/
│
├── Crud/ # Módulos CRUD (Create, Read, Update, Delete) para cada entidad
│ ├── asignacionT_crud.py # Operaciones CRUD para asignaciones
│ ├── auditoria_crud.py # Operaciones CRUD para registros de auditoría
│ ├── empleado_crud.py # Operaciones CRUD para empleados
│ ├── linea_crud.py # Operaciones CRUD para líneas de transporte
│ ├── parada_crud.py # Operaciones CRUD para paradas
│ ├── ruta_crud.py # Operaciones CRUD para rutas
│ ├── tarjeta_crud.py # Operaciones CRUD para tarjetas
│ ├── transacciones_crud.py # Operaciones CRUD para transacciones
│ ├── transporte_crud.py # Operaciones CRUD para medios de transporte
│ └── usuario_crud.py # Operaciones CRUD para usuarios
│
├── database/ # Configuración y conexión a la base de datos
│ ├── init.py
│ └── config.py # Configuración de la conexión a la base de datos
│
├── Entities/ # Definición de entidades y modelos del sistema
│ ├── asignacionT.py # Modelo de asignaciones
│ ├── auditoria.py # Modelo de auditoría
│ ├── empleado.py # Modelo de empleados
│ ├── linea.py # Modelo de líneas de transporte
│ ├── parada.py # Modelo de paradas
│ ├── roles.py # Modelo de roles de usuario
│ ├── ruta.py # Modelo de rutas
│ ├── tarjeta.py # Modelo de tarjetas
│ ├── transaccion.py # Modelo de transacciones
│ ├── transporte.py # Modelo de transporte
│ └── usuario.py # Modelo de usuarios
│
├── Utilities/ # Funciones utilitarias y soporte del sistema
│ ├── init_db.py # Inicialización y creación de tablas en la BD
│ ├── logica.py # Lógica de negocio central
│ └── menus.py # Menús y opciones de interacción para el usuario
│
├── main.py # Punto de entrada principal del sistema
├── requirements.txt # Dependencias necesarias para ejecutar el proyecto
├── README.md # Documentación del proyecto
└── .gitignore # Archivos y carpetas ignorados por git
```
---

## Instalación

Clona este repositorio:  

  ```bash
  git clone https://github.com/cristiancallep/SistemaTransportePublico.git
  cd SistemaTransportePublico
  ```

## Uso

### Instalar dependencias

Instala todas las librerías necesarias desde el archivo requirements.txt:
```bash
pip install -r requirements.txt
```
### Añadir archivos necesarios
Se deberan añadir en el primer nivel el archivo '.env'.

 ### Ejecuta el programa en la terminal con:

```bash
python .\main.py
```
o también con
```bash
py .\main.py
```

---

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

## Funcionamiento del Menú
El sistema, esta compuesto por 2 menus diferentes, y su visualización varia depende del tipo de usuario(administrador,cliente). Estos se encuentran dentro de la carpeta 'Utilities/' en el archivo 'menus.py'.

### Menu usuario
Corresponde al menu mostrado al tipo de usuario cliente, permitiendo opciones como: Crear Tarjeta, Recargar Tarjeta, Consultar Saldo, Comprar Tiquete y ver Tiquetes y transportes asignados.
Este menu procesa la opcion solicitada por el usuario, y llama los metodos necesarios de la otra parte del proyecto que se encuentran en 'Utilities/logica.py'.

### Menu Administrador
Corresponde al menu mostrado al tipo de usuario administrados, que es el encargado de manejar los usos del sistema, teniendo opciones que le permitan: Registrar usuarios, Actualizar usuarios, Eliminar usuarios, Consultar usuarios, ver cambios, Registrar empleado, Actualizar empleado, Eliminar empleado, Consultar empleados, Agregar ruta, Modificar Ruta, Agregar linea, Agregar transporte, asignar transporte a usuario, ver asignaciones y tiquetes.

Este menu procesa la opcion solicitada por el administrador, y llama los metodos necesarios de la otra parte del proyecto que se encuentran en 'Utilities/logica.py'.
Y sus funciones son estrictamente para este tipo de usuario, garantizando un buen funcionamiento y diferenciacion de roles.

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

5. Flujo resumido del sistema
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

Generar reportes y monitorear el sistema.

## Ejemplo de Uso

Ejemplo de uso para tipo de cliente usuario. Funcionalidad: Crear Tarjeta

## 🎴 Flujo para crear una tarjeta  

### 1. Inicio  
- El sistema pregunta si el usuario ya tiene cuenta.  
- **Si tiene cuenta** → inicia sesión.  
- **Si no tiene cuenta** → se registra en el sistema.  

### 2. Menú de usuario  
- Una vez dentro, el sistema muestra el menú principal para usuarios.  
- El usuario selecciona la **opción 1: Crear tarjeta**.  

### 3. Ingreso de documento  
- El sistema solicita el número de documento.  
- El usuario lo ingresa y el sistema hace sus validaciones.  

### 4. Creación de la tarjeta  
- El sistema llama al método:  
  ```python
  logica.crear_tarjeta(documento=documento)

- **Si ya tiene tarjeta registrada** → El sistema no permite que cree otra.
- **Si no tiene tarjeta registrada** → El sistema la crea y la guarda en la base de datos.

-El sistema imprime el número de la tarjeta.
-El sistema vuelve a mostrar el menú.



## 👨‍💻 Créditos

Proyecto desarrollado por:  
- Cristian Calle
- Tomás Álvarez
- Emely Loaiza Ocampo

