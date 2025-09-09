"""
Configuración de la base de datos
=================================

Configuraciones centralizadas para la conexión a la base de datos.
"""
import os # para accerder a variables de entorno

# URL de la base de datos
DATABASE_URL: str = os.getenv(
    "DATABASE_URL", 
    "sqlite:///./database/sistemaTransporte.db"
)

DB_ECHO: bool = os.getenv("DB_ECHO", "True").lower() == "False"
DB_POOL_SIZE: int = int(os.getenv("DB_POOL_SIZE", "5"))
DB_MAX_OVERFLOW: int = int(os.getenv("DB_MAX_OVERFLOW", "10"))

class DatabaseConfig:
    """Configuración de base de datos para diferentes entornos"""
    
    @staticmethod
    def get_sqlite_config(db_name: str = "sistemaTransporte.db") -> str:
        """Configuración para SQLite (desarrollo)"""
        return f"sqlite:///./database/{db_name}"