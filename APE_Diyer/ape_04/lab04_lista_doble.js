// Lista Doblemente Enlazada: navegación hacia adelante y hacia atrás (contexto "siguiente video")
class NodoDoble {
    constructor(dato) {
        this.dato = dato;
        this.siguiente = null; // Referencia al nodo posterior
        this.anterior = null;  // Referencia al nodo previo (bidireccional)
    }
}

class ListaDoble {
    constructor() {
        this.cabeza = null;
        this.cola = null;
        this.actual = null; // Cursor de navegación
        this.tamaño = 0;
    }

    // Inserta al inicio: O(1)
    prepend(dato) {
        const nuevo = new NodoDoble(dato);
        if (!this.cabeza) {
            this.cabeza = this.cola = this.actual = nuevo;
        } else {
            nuevo.siguiente = this.cabeza;
            this.cabeza.anterior = nuevo;
            this.cabeza = nuevo;
        }
        this.tamaño++;
    }

    // Inserta al final: O(1) gracias al puntero a la cola
    append(dato) {
        const nuevo = new NodoDoble(dato);
        if (!this.cola) {
            this.cabeza = this.cola = this.actual = nuevo;
        } else {
            nuevo.anterior = this.cola;
            this.cola.siguiente = nuevo;
            this.cola = nuevo;
        }
        this.tamaño++;
    }

    // Avanza al siguiente elemento: O(1)
    next() {
        if (this.actual && this.actual.siguiente) {
            this.actual = this.actual.siguiente;
        }
        return this.actual ? this.actual.dato : null;
    }

    // Retrocede al elemento anterior: O(1)
    prev() {
        if (this.actual && this.actual.anterior) {
            this.actual = this.actual.anterior;
        }
        return this.actual ? this.actual.dato : null;
    }

    // Recorrido secuencial: O(n)
    imprimirPrimeros(limite) {
        let nodo = this.cabeza;
        let contador = 0;
        let salida = "NULL <-> ";
        while (nodo && contador < limite) {
            salida += `[ID: ${nodo.dato.id}] <-> `;
            nodo = nodo.siguiente;
            contador++;
        }
        console.log(salida + "NULL");
    }
}

module.exports = { ListaDoble };
