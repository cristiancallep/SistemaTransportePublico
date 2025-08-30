# Sistema de Transporte Público

Este proyecto es un **sistema de transporte público** implementado en Python, que utiliza los conceptos de Programación Orientada a Objetos (POO): **herencia, polimorfismo y encapsulamiento**. Permite simular la compra de tiquetes y la gestión de saldo en una tarjeta para diferentes medios de transporte: Bus, Metro y Tranvía.

---

## Estructura del Proyecto

- `src/`: Implementación modular, separando clases y lógica en diferentes archivos.
- `main.py`: Archivo principal que ejecuta el menú interactivo para el usuario.

SistemaTransportePublico  
├── src  
&nbsp;&nbsp;&nbsp;&nbsp;├─ Transporte.py # Clase base y clases hijas (Bus, Metro, Tranvía)  
&nbsp;&nbsp;&nbsp;&nbsp;├─ Tarjeta.py # Lógica de saldo y acceso al titular  
&nbsp;&nbsp;&nbsp;&nbsp;├─ Gestor.py # Gestión centralizada de tarjetas y operaciones  
├── main.py # Interfaz de usuario (menú y flujo principal)  
├── README.md # Este archivo

---

## Instalación

Clona este repositorio:  

  ```bash
  git clone https://github.com/cristiancallep/SistemaTransportePublico.git
  cd SistemaTransportePublico
  ```

## Uso

Ejecuta el programa en la terminal con:

```bash
python .\main.py
```
o también con
```bash
py .\main.py
```

---

## Clases Principales

### 1. Tarjeta

- **Encapsulamiento:** El saldo es un atributo privado (`__saldo`).
- **Métodos:**
  - `recargar(valor)`: Recarga la tarjeta con un valor positivo.
  - `pagar(valor)`: Descuenta el valor del saldo si hay suficiente dinero.
  - `consultar_saldo()`: Muestra el saldo actual.

### 2. Transporte (Clase Base)

- **Herencia:** Clase base para los diferentes medios de transporte.
- **Métodos:**
  - `costo_tiquete()`: Método abstracto, debe ser implementado por las subclases.
  - `vender_tiquete(tarjeta)`: Intenta vender un tiquete usando la tarjeta.

### 3. Bus, Metro, Tranvía (Subclases de Transporte)

- **Polimorfismo:** Cada subclase implementa su propio costo de tiquete y demás propiedades únicas.
  - `Bus`: $2500
  - `Metro`: $2800
  - `Tranvía`: $2700

---

## Funcionamiento del Menú

El usuario puede:

1. **Conseguir tarjeta:** Ingresa un monto positivo para aumentar el saldo.
2. **Recargar tarjeta:** Ingresa un monto positivo para aumentar el saldo.
3. **Consultar tarjetas:** Muestra el saldo actual de la tarjeta.
4. **Consultar saldo:** Muestra el saldo actual de la tarjeta.
5. **Comprar tiquete en Bus/Metro/Tranvía:** Descuenta el valor correspondiente si hay saldo suficiente.
6. **Salir:** Termina el programa.

El menú valida las entradas del usuario y muestra mensajes claros en caso de errores o acciones exitosas.

---

## Ejemplo de Uso

--- 🚏 Sistema de Transporte Público 🚏 ---  
🔶 1. Conseguir tarjeta  
🔶 2. Recargar tarjeta  
🔶 3. Consultar saldo  
🔶 4. Consultar tarjetas  
🔶 5. Comprar tiquete en Bus  
🔶 6. Comprar tiquete en Metro  
🔶 7. Comprar tiquete en Tranvía  
🔶 8. Salir  
Seleccione una opción: 1  
Ingrese valor a recargar: 5000  
✅ Recarga exitosa, nuevo saldo: 5000

## 👨‍💻 Créditos

Proyecto desarrollado por:  
- Cristian Calle
- Tomás Álvarez
- Emely Loaiza Ocampo

Inspirado en la aplicación de Programación Orientada a Objetos (POO) para la simulación de transporte público.