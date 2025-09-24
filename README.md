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

