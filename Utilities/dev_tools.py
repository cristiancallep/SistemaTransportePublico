"""
Script de desarrollo para formatear código con Black
===================================================

Este script facilita el uso de Black formatter en el proyecto.
"""

import subprocess
import sys
from pathlib import Path


def run_black_format():
    """Aplica Black formatter a todos los archivos del proyecto."""
    project_root = Path(__file__).parent.parent
    cmd = [
        sys.executable,
        "-m",
        "black",
        ".",
        "--exclude",
        r"venv|__pycache__|\.git",
        "--line-length",
        "88",
    ]

    print(" Aplicando Black formatter al proyecto...")
    result = subprocess.run(cmd, cwd=project_root, capture_output=True, text=True)

    if result.returncode == 0:
        print(" Formato aplicado exitosamente!")
        print(result.stdout)
    else:
        print(" Error al aplicar formato:")
        print(result.stderr)

    return result.returncode


def check_black_format():
    """Verifica si todos los archivos están correctamente formateados."""
    project_root = Path(__file__).parent.parent
    cmd = [
        sys.executable,
        "-m",
        "black",
        ".",
        "--check",
        "--exclude",
        r"venv|__pycache__|\.git",
        "--line-length",
        "88",
    ]

    print(" Verificando formato Black...")
    result = subprocess.run(cmd, cwd=project_root, capture_output=True, text=True)

    if result.returncode == 0:
        print(" Todos los archivos están correctamente formateados!")
        print(result.stdout)
    else:
        print(" Algunos archivos necesitan formateo:")
        print(result.stdout)
        print("Ejecuta 'python tools.py format' para aplicar el formato.")

    return result.returncode


if __name__ == "__main__":
    if len(sys.argv) > 1:
        action = sys.argv[1].lower()
        if action == "format":
            sys.exit(run_black_format())
        elif action == "check":
            sys.exit(check_black_format())
        else:
            print("Uso: python dev_tools.py [format|check]")
            sys.exit(1)
    else:
        print("  Herramientas de desarrollo - Sistema de Transporte Público")
        print("==========================================================")
        print()
        print("Uso:")
        print("  python dev_tools.py format  - Aplica Black formatter")
        print("  python dev_tools.py check   - Verifica formato Black")
