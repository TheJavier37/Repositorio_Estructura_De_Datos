const NodoDoble = require('./NodoDoble');

/**
 * Estructura de datos dinámica para la gestión de navegación bidireccional.
 */
class ListaDobleNavegacion {
  /**
   * @param {number} [capacidadMaxima=Infinity] - Límite de registros del historial.
   *        Al superarlo se descarta el registro más antiguo (control de memoria en el heap).
   */
  constructor(capacidadMaxima = Infinity) {
    if (capacidadMaxima < 1) throw new RangeError('La capacidad máxima debe ser >= 1');
    this.capacidadMaxima = capacidadMaxima;
    this.cabeza = null;
    this.cola = null;
    this.actual = null; // Puntero/Cursor de navegación activa
    this.longitud = 0;
  }

  /**
   * Inserta un nuevo registro al final de la lista. Complejidad: O(1)
   * @param {Object} dato - Registro a almacenar.
   * @returns {NodoDoble} El nodo creado.
   */
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
    if (this.longitud > this.capacidadMaxima) this._descartarMasAntiguo();
    return nuevoNodo;
  }

  /**
   * Descarta la cabeza (registro más antiguo) y libera sus referencias. Complejidad: O(1)
   * @private
   */
  _descartarMasAntiguo() {
    const viejo = this.cabeza;
    this.cabeza = viejo.siguiente;
    this.cabeza.anterior = null;
    if (this.actual === viejo) this.actual = this.cabeza;
    viejo.siguiente = null;
    this.longitud--;
  }

  /**
   * Desplaza el cursor activo hacia el siguiente nodo. Complejidad: O(1)
   * @returns {Object|null} El dato del nuevo nodo activo o null si alcanza el final.
   */
  avanzar() {
    if (this.actual && this.actual.siguiente) {
      this.actual = this.actual.siguiente;
      return this.actual.dato;
    }
    return null;
  }

  /**
   * Desplaza el cursor activo hacia el nodo anterior. Complejidad: O(1)
   * @returns {Object|null} El dato del nuevo nodo activo o null si alcanza el inicio.
   */
  retroceder() {
    if (this.actual && this.actual.anterior) {
      this.actual = this.actual.anterior;
      return this.actual.dato;
    }
    return null;
  }

  /**
   * Retorna el elemento actualmente seleccionado por el cursor.
   * @returns {Object|null}
   */
  obtenerActual() {
    return this.actual ? this.actual.dato : null;
  }

  /**
   * Elimina el elemento en la posición actual y reconecta los enlaces.
   * Libera las referencias internas para apoyar la gestión de memoria. Complejidad: O(1)
   * @returns {boolean} Confirmación de eliminación.
   */
  eliminarActual() {
    if (!this.actual) return false;

    const nodoAEliminar = this.actual;

    // Reconexión del enlace anterior
    if (nodoAEliminar.anterior) {
      nodoAEliminar.anterior.siguiente = nodoAEliminar.siguiente;
    } else {
      this.cabeza = nodoAEliminar.siguiente;
    }

    // Reconexión del enlace siguiente
    if (nodoAEliminar.siguiente) {
      nodoAEliminar.siguiente.anterior = nodoAEliminar.anterior;
      this.actual = nodoAEliminar.siguiente;
    } else {
      this.cola = nodoAEliminar.anterior;
      this.actual = nodoAEliminar.anterior;
    }

    // Limpieza explícita de referencias (Garbage Collection Helper)
    nodoAEliminar.siguiente = null;
    nodoAEliminar.anterior = null;

    this.longitud--;
    return true;
  }

  /**
   * Indica si la lista no contiene registros. Complejidad: O(1)
   * @returns {boolean}
   */
  estaVacia() {
    return this.longitud === 0;
  }

  /**
   * Mueve el cursor al primer registro. Complejidad: O(1)
   * @returns {Object|null}
   */
  irAlInicio() {
    this.actual = this.cabeza;
    return this.obtenerActual();
  }

  /**
   * Mueve el cursor al último registro. Complejidad: O(1)
   * @returns {Object|null}
   */
  irAlFinal() {
    this.actual = this.cola;
    return this.obtenerActual();
  }

  /**
   * Mueve el cursor a una posición (base 0), recorriendo desde el extremo más cercano.
   * Complejidad: O(n/2)
   * @param {number} indice
   * @returns {Object|null} Dato en esa posición o null si el índice es inválido.
   */
  irA(indice) {
    if (!Number.isInteger(indice) || indice < 0 || indice >= this.longitud) return null;
    let nodo;
    if (indice <= this.longitud / 2) {
      nodo = this.cabeza;
      for (let i = 0; i < indice; i++) nodo = nodo.siguiente;
    } else {
      nodo = this.cola;
      for (let i = this.longitud - 1; i > indice; i--) nodo = nodo.anterior;
    }
    this.actual = nodo;
    return nodo.dato;
  }

  /**
   * Busca el primer registro que cumpla el predicado y coloca el cursor en él.
   * Si no hay coincidencia, el cursor no se mueve. Complejidad: O(n)
   * @param {(dato: Object) => boolean} predicado
   * @returns {Object|null}
   */
  buscar(predicado) {
    let nodo = this.cabeza;
    while (nodo) {
      if (predicado(nodo.dato)) {
        this.actual = nodo;
        return nodo.dato;
      }
      nodo = nodo.siguiente;
    }
    return null;
  }

  /**
   * Comportamiento tipo navegador: inserta un registro justo después del actual,
   * descarta todo el historial "hacia adelante" y deja el cursor en el nuevo registro.
   * Complejidad: O(k), k = nodos descartados (liberados para el recolector de basura).
   * @param {Object} dato
   * @returns {NodoDoble}
   */
  navegarA(dato) {
    if (this.actual) {
      let nodo = this.actual.siguiente;
      while (nodo) {
        const sig = nodo.siguiente;
        nodo.siguiente = null;
        nodo.anterior = null;
        this.longitud--;
        nodo = sig;
      }
      this.actual.siguiente = null;
      this.cola = this.actual;
    }
    const nuevo = this.insertar(dato);
    this.actual = nuevo;
    return nuevo;
  }

  /**
   * Convierte la lista a arreglo. Complejidad: O(n)
   * @param {boolean} [invertido=false] - Si es true recorre desde la cola hacia la cabeza.
   * @returns {Object[]}
   */
  toArray(invertido = false) {
    const resultado = [];
    let nodo = invertido ? this.cola : this.cabeza;
    while (nodo) {
      resultado.push(nodo.dato);
      nodo = invertido ? nodo.anterior : nodo.siguiente;
    }
    return resultado;
  }

  /**
   * Vacía la lista liberando todos los nodos. Complejidad: O(n)
   */
  limpiar() {
    let nodo = this.cabeza;
    while (nodo) {
      const sig = nodo.siguiente;
      nodo.siguiente = null;
      nodo.anterior = null;
      nodo = sig;
    }
    this.cabeza = this.cola = this.actual = null;
    this.longitud = 0;
  }
}

module.exports = ListaDobleNavegacion;
