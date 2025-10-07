# Guía de Formato de Código - Black Formatter

## Qué es Black Formatter
Black es un formateador automático de código Python que garantiza un estilo consistente en todo el proyecto. Elimina debates sobre formato y mejora la legibilidad del código.

## Configuración del Proyecto
- **Longitud de línea**: 88 caracteres
- **Versión Python**: 3.12
- **Archivos excluidos**: venv, __pycache__, .git

## Instalación y Configuración

### 1. Prerequisitos
- Python 3.7 o superior instalado
- Entorno virtual activado (recomendado)

### 2. Instalar Black
```bash
# Opción 1: Con pip
pip install black

# Opción 2: Usar requirements.txt del proyecto
pip install -r requirements.txt
```

### 3. Verificar instalación
```bash
black --version
```

## Uso de Black

### Método 1: Script de Desarrollo (Recomendado)
El proyecto incluye `dev_tools.py` para facilitar el uso:

```bash
# Verificar si el código necesita formato
python dev_tools.py check

# Aplicar formato automáticamente
python dev_tools.py format
```

### Método 2: Black Directo
```bash
# Formatear todo el proyecto
black . --exclude="venv|__pycache__|\.git" --line-length=88

# Solo verificar (sin modificar archivos)
black . --check --exclude="venv|__pycache__|\.git" --line-length=88

# Ver qué cambiaría sin aplicarlo
black . --diff --exclude="venv|__pycache__|\.git" --line-length=88
```

### Método 3: Formatear archivos específicos
```bash
# Un solo archivo
black archivo.py

# Múltiples archivos
black archivo1.py archivo2.py

# Una carpeta específica
black Entities/
```

## Configuración del Proyecto

### Archivo pyproject.toml
El proyecto incluye configuración automática en `pyproject.toml`:

```toml
[tool.black]
line-length = 88
target-version = ['py312']
include = '\.pyi?$'
exclude = '''
/(
    \.git
  | \.hg
  | \.mypy_cache
  | \.tox
  | \.venv
  | venv
  | _build
  | buck-out
  | build
  | dist
  | __pycache__
)/
'''
```

Esta configuración se aplica automáticamente cuando ejecutas Black en el directorio del proyecto.

## Estructura de Archivos Python

### Directorios principales a formatear:
- **main.py** - Archivo principal de la aplicación
- **api/** - Routers y dependencias de FastAPI
- **Crud/** - Operaciones de base de datos
- **Entities/** - Modelos SQLAlchemy y Pydantic
- **database/** - Configuración de base de datos
- **Utilities/** - Herramientas y utilidades
- **dev_tools.py** - Script de desarrollo

### Directorios excluidos automáticamente:
- **venv/** - Entorno virtual
- **__pycache__/** - Archivos compilados Python
- **.git/** - Control de versiones

## Integración con Editores

### Visual Studio Code
1. Instalar extensión "Python"
2. Configurar en settings.json:
```json
{
    "python.formatting.provider": "black",
    "python.formatting.blackArgs": ["--line-length=88"],
    "editor.formatOnSave": true
}
```

### PyCharm
1. Ir a Settings > Tools > External Tools
2. Añadir Black como herramienta externa
3. Configurar shortcut para formateo rápido

## Comandos Útiles

### Para desarrolladores nuevos:
```bash
# 1. Clonar el proyecto
git clone <repository-url>
cd SistemaTransportePublico

# 2. Crear entorno virtual
python -m venv venv

# 3. Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 4. Instalar dependencias (incluye Black)
pip install -r requirements.txt

# 5. Verificar formato del proyecto
python dev_tools.py check

# 6. Si es necesario, aplicar formato
python dev_tools.py format
```

### Para mantenimiento continuo:
```bash
# Antes de hacer commit
black . --check --exclude="venv|__pycache__|\.git"

# Formatear antes de push
black . --exclude="venv|__pycache__|\.git"
```

## Flujo de Trabajo Recomendado

1. **Antes de empezar a programar:**
   ```bash
   python dev_tools.py check
   ```

2. **Durante el desarrollo:**
   - Configurar editor para formateo automático al guardar
   - O ejecutar Black en archivos específicos

3. **Antes de hacer commit:**
   ```bash
   python dev_tools.py format
   git add .
   git commit -m "Tu mensaje"
   ```

## Resolución de Problemas

### Black no se encuentra
```bash
# Verificar que esté instalado
pip list | grep black

# Si no está, instalar
pip install black
```

### Error de permisos (Windows)
```bash
# Usar python -m en lugar de comando directo
python -m black . --exclude="venv|__pycache__|\.git"
```

### Formateo no se aplica
```bash
# Verificar que estés en el directorio correcto
pwd  # Linux/Mac
cd    # Windows

# Verificar archivos Python en directorio
find . -name "*.py" | head -5  # Linux/Mac
dir *.py /s | head -5          # Windows
```

## Beneficios de Black

- **Consistencia**: Todo el equipo usa el mismo estilo
- **Velocidad**: No perder tiempo decidiendo formato
- **Legibilidad**: Código más fácil de leer y revisar
- **Automatización**: Se integra con editores y CI/CD
- **Estándar**: Usado por grandes proyectos Python

## Recursos Adicionales

- [Documentación oficial de Black](https://black.readthedocs.io/)
- [Playground online](https://black.vercel.app/)
- [Integración con pre-commit](https://pre-commit.com/)