class Nodo {
  constructor(dato) {
    this.dato = dato;
    this.siguiente = null;
    this.anterior = null;
  }
}

class ListaSatelital {
  constructor() {
    this.cabeza = null;
    this.cola = null;
    this.actual = null; // cursor de navegación
    this.tamaño = 0;
  }

  // O(1)
  prepend(dato) {
    const nuevo = new Nodo(dato);
    if (!this.cabeza) {
      this.cabeza = this.cola = this.actual = nuevo;
    } else {
      nuevo.siguiente = this.cabeza;
      this.cabeza.anterior = nuevo;
      this.cabeza = nuevo;
    }
    this.tamaño++;
  }

  // O(1)
  append(dato) {
    const nuevo = new Nodo(dato);
    if (!this.cola) {
      this.cabeza = this.cola = this.actual = nuevo;
    } else {
      nuevo.anterior = this.cola;
      this.cola.siguiente = nuevo;
      this.cola = nuevo;
    }
    this.tamaño++;
  }

  // O(1): avanza el cursor si existe siguiente
  next() {
    if (this.actual && this.actual.siguiente) this.actual = this.actual.siguiente;
    return this.actual ? this.actual.dato : null;
  }

  // O(1): retrocede el cursor si existe anterior
  prev() {
    if (this.actual && this.actual.anterior) this.actual = this.actual.anterior;
    return this.actual ? this.actual.dato : null;
  }

  // O(1): lleva el cursor a la cabeza
  irAlInicio() {
    this.actual = this.cabeza;
    return this.actual ? this.actual.dato : null;
  }

  // O(n)
  imprimirPrimeros(limite) {
    let nodo = this.cabeza, i = 0, salida = "";
    while (nodo && i < limite) {
      salida += `[ID: ${nodo.dato.id}] <-> `;
      nodo = nodo.siguiente;
      i++;
    }
    console.log(salida + "NULL");
  }
}

module.exports = { Nodo, ListaSatelital };
