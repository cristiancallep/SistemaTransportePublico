# Sistema de Transporte Público

- Este proyecto es un sistema para la gestión de transporte público. Incluye manejo de usuarios, auditorías, rutas, tarjetas, transportes, entre otros. Está desarrollado en **Python** y utiliza **SQLAlchemy** como ORM para la gestión de la base de datos.
---

## Estructura del Proyecto

```
SistemaTransportePublico/
│
├── Crud/ # Contiene la lógica CRUD (Crear, Leer, Actualizar y Eliminar) para interactuar con la base de datos.
│ ├── auditoria_crud.py
│ └── usuario_crud.py
│
├── database/ Configuración de la conexión a la base de datos y cualquier archivo relacionado a esta.
│ ├── init.py
│ └── config.py
│
├── Entities/ #Define las entidades o modelos que representan las tablas de la base de datos.
│ ├── asignacionT.py 
│ ├── auditoria.py 
│ ├── empleado.py 
│ ├── linea.py 
│ ├── parada.py 
│ ├── roles.py 
│ ├── ruta.py 
│ ├── tarjeta.py 
│ ├── transporte.py 
│ └── usuario.py 
│
├── seeders/ # Scripts para poblar la base de datos con datos iniciales (no se versiona)
│ ├── init.py
│ └── usuario_seeder.py
│
├── main.py # Punto de entrada de la aplicación
├── requirements.txt # Dependencias del proyecto
├── .env # Variables de entorno (no se versiona)
├── .gitignore #Define qué archivos y carpetas no se deben subir a Git.
└── README.md #Documentación y guía del proyecto. (actual)
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


---

## Funcionamiento del Menú


---

## Ejemplo de Uso


## 👨‍💻 Créditos

Proyecto desarrollado por:  
- Cristian Calle
- Tomás Álvarez
- Emely Loaiza Ocampo

