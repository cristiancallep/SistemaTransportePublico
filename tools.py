#!/usr/bin/env python3
"""
Script de acceso rápido a herramientas del proyecto
=================================================

Este script facilita el acceso a herramientas desde la raíz del proyecto.
"""

import os
import sys
import subprocess
from pathlib import Path


def show_help():
    """Muestra la ayuda de comandos disponibles"""
    print("  Herramientas del Sistema de Transporte Público")
    print("=" * 50)
    print()
    print("Uso: python tools.py [comando]")
    print()
    print("Comandos disponibles:")
    print("  format     - Aplicar Black formatter")
    print("  check      - Verificar formato Black")
    print("  install    - Instalar dependencias")
    print("  run        - Ejecutar API (main.py)")
    print("  help       - Mostrar esta ayuda")
    print()
    print("Ejemplos:")
    print("  python tools.py format")
    print("  python tools.py check")
    print("  python tools.py install")


def run_dev_tools(action):
    """Ejecuta herramientas de desarrollo"""
    script_path = Path(__file__).parent / "Utilities" / "dev_tools.py"
    cmd = [sys.executable, str(script_path), action]
    subprocess.run(cmd, cwd=Path(__file__).parent)


def install_dependencies():
    """Instala dependencias del proyecto"""
    requirements_path = Path(__file__).parent / "config" / "requirements.txt"
    cmd = [sys.executable, "-m", "pip", "install", "-r", str(requirements_path)]
    print(f" Instalando dependencias desde: {requirements_path}")
    subprocess.run(cmd)


def run_api():
    """Ejecuta la API"""
    main_path = Path(__file__).parent / "main.py"
    cmd = [sys.executable, str(main_path)]
    print(" Iniciando API...")
    # Configurar PYTHONPATH
    os.environ["PYTHONPATH"] = str(Path(__file__).parent)
    subprocess.run(cmd, cwd=Path(__file__).parent)


def main():
    """Función principal"""
    if len(sys.argv) < 2:
        show_help()
        return

    command = sys.argv[1].lower()

    if command in ["format", "check"]:
        run_dev_tools(command)
    elif command == "install":
        install_dependencies()
    elif command == "run":
        run_api()
    elif command == "help":
        show_help()
    else:
        print(f" Comando desconocido: {command}")
        print("Usa 'python tools.py help' para ver comandos disponibles")


if __name__ == "__main__":
    main()
