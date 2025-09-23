import Utilities.logica as logica
import Utilities.menus as menus


def inicio():
    while True:
        tiene_cuenta = input("¿Tiene cuenta? (s/n): ").strip().lower()
        if tiene_cuenta == "s":
            usuario = logica.iniciar_sesion()
            logica.usuario_actual = usuario
            if usuario:
                if usuario.id_rol == 1:
                    menus.menuAdmin()
                else:
                    menus.menuUsuario()
                break
        elif tiene_cuenta == "n":
            logica.registrar()
        else:
            print("Opción inválida. Ingrese 's' o 'n'.")


if __name__ == "__main__":
    inicio()
