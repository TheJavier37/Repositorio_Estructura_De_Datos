const NodoDoble = require('./NodoDoble');

/**
 * Estructura de datos dinámica para la gestión de navegación bidireccional.
 */
class ListaDobleNavegacion {
    constructor() {
        this.cabeza = null;
        this.cola = null;
        this.actual = null; // Puntero/Cursor de navegación activa
        this.longitud = 0;
    }

    insertar(dato) {
        const nuevoNodo = new NodoDoble(dato);
        if (!this.cabeza) {
        this.cabeza = nuevoNodo;
        this.cola = nuevoNodo;
        this.actual = nuevoNodo;
        } else {
        this.cola.siguiente = nuevoNodo;
        nuevoNodo.anterior = this.cola;
        this.cola = nuevoNodo;
        }
        this.longitud++;
        return nuevoNodo;
    }

    avanzar() {
        if (this.actual && this.actual.siguiente) {
        this.actual = this.actual.siguiente;
        return this.actual.dato;
        }
        return null;
    }

    retroceder() {
        if (this.actual && this.actual.anterior) {
        this.actual = this.actual.anterior;
        return this.actual.dato;
        }
        return null;
    }

    obtenerActual() {
        return this.actual ? this.actual.dato : null;
    }

    eliminarActual() {
        if (!this.actual) return false;
        const nodoAEliminar = this.actual;

        if (nodoAEliminar.anterior) {
        nodoAEliminar.anterior.siguiente = nodoAEliminar.siguiente;
        } else {
        this.cabeza = nodoAEliminar.siguiente;
        }

        if (nodoAEliminar.siguiente) {
        nodoAEliminar.siguiente.anterior = nodoAEliminar.anterior;
        this.actual = nodoAEliminar.siguiente;
        } else {
        this.cola = nodoAEliminar.anterior;
        this.actual = nodoAEliminar.anterior;
        }

        nodoAEliminar.siguiente = null;
        nodoAEliminar.anterior = null;
        this.longitud--;
        return true;
    }
}

module.exports = ListaDobleNavegacion;