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
    // Validación: una lista con capacidad 0 o negativa no podría guardar ningún registro.
    if (capacidadMaxima < 1) throw new RangeError('La capacidad máxima debe ser >= 1');
    // Infinity (valor por defecto) significa "sin límite": la lista se comporta como antes.
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
    // Si al insertar se supera el límite, se elimina el registro más antiguo (la cabeza).
    // Así el historial nunca ocupa más memoria en el heap de lo permitido.
    if (this.longitud > this.capacidadMaxima) this._descartarMasAntiguo();
    return nuevoNodo;
  }

  /**
   * Descarta la cabeza (registro más antiguo) y libera sus referencias. Complejidad: O(1)
   * @private
   */
  _descartarMasAntiguo() {
    const viejo = this.cabeza;            // Registro más antiguo: será descartado
    this.cabeza = viejo.siguiente;        // La nueva cabeza es el segundo nodo
    this.cabeza.anterior = null;          // La nueva cabeza ya no apunta hacia atrás
    // Si el cursor estaba justo en el nodo descartado, lo movemos a la nueva cabeza
    // para que no quede apuntando a un nodo que ya no pertenece a la lista.
    if (this.actual === viejo) this.actual = this.cabeza;
    viejo.siguiente = null;               // Cortamos el enlace para que el recolector de basura (GC) lo libere
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
    // Basta con mirar el contador: no hace falta recorrer ningún nodo.
    return this.longitud === 0;
  }

  /**
   * Mueve el cursor al primer registro. Complejidad: O(1)
   * @returns {Object|null}
   */
  irAlInicio() {
    this.actual = this.cabeza; // La lista guarda la cabeza, por eso el salto es directo
    return this.obtenerActual(); // Devuelve el dato (o null si la lista está vacía)
  }

  /**
   * Mueve el cursor al último registro. Complejidad: O(1)
   * @returns {Object|null}
   */
  irAlFinal() {
    this.actual = this.cola; // La lista guarda la cola, por eso el salto es directo
    return this.obtenerActual();
  }

  /**
   * Mueve el cursor a una posición (base 0), recorriendo desde el extremo más cercano.
   * Complejidad: O(n/2)
   * @param {number} indice
   * @returns {Object|null} Dato en esa posición o null si el índice es inválido.
   */
  irA(indice) {
    // Índice inválido (no entero, negativo o fuera de rango): no se mueve el cursor.
    if (!Number.isInteger(indice) || indice < 0 || indice >= this.longitud) return null;
    let nodo;
    if (indice <= this.longitud / 2) {
      // Primera mitad: se parte desde la cabeza y se avanza 'indice' veces.
      nodo = this.cabeza;
      for (let i = 0; i < indice; i++) nodo = nodo.siguiente;
    } else {
      // Segunda mitad: se parte desde la cola y se retrocede hasta llegar al índice.
      // Esto es posible gracias a que la lista es doble (tiene enlaces 'anterior').
      nodo = this.cola;
      for (let i = this.longitud - 1; i > indice; i--) nodo = nodo.anterior;
    }
    this.actual = nodo; // Solo se actualiza el cursor cuando se encontró el nodo
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
    while (nodo) { // Recorre de cabeza a cola; en el peor caso revisa los n nodos
      if (predicado(nodo.dato)) { // El predicado es una función que decide si el dato coincide
        this.actual = nodo;       // Primera coincidencia: el cursor se coloca aquí
        return nodo.dato;
      }
      nodo = nodo.siguiente;
    }
    return null; // Sin coincidencias: el cursor se queda donde estaba
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
      // 1. Se descarta todo lo que está "hacia adelante" del cursor, igual que un navegador
      //    cuando abres una página nueva estando en medio del historial.
      let nodo = this.actual.siguiente;
      while (nodo) {
        const sig = nodo.siguiente; // Guardamos el siguiente ANTES de cortar los enlaces
        nodo.siguiente = null;      // Se cortan los enlaces para que el GC libere el nodo
        nodo.anterior = null;
        this.longitud--;
        nodo = sig;
      }
      // 2. El nodo actual pasa a ser el último de la lista.
      this.actual.siguiente = null;
      this.cola = this.actual;
    }
    // 3. Se agrega el nuevo registro al final y el cursor se coloca en él.
    //    (Si había capacidad máxima, insertar() también descarta el más antiguo.)
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
    // Punto de partida: la cola si se pide invertido, la cabeza en caso contrario.
    let nodo = invertido ? this.cola : this.cabeza;
    while (nodo) {
      resultado.push(nodo.dato);
      // Dirección del recorrido: hacia atrás (anterior) o hacia adelante (siguiente).
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
      const sig = nodo.siguiente; // Se guarda el siguiente antes de romper los enlaces
      nodo.siguiente = null;      // Al no quedar referencias entre nodos,
      nodo.anterior = null;       // el recolector de basura puede liberar la memoria
      nodo = sig;
    }
    // La lista queda en el mismo estado que una recién creada (pero conserva su capacidad máxima).
    this.cabeza = this.cola = this.actual = null;
    this.longitud = 0;
  }
}

module.exports = ListaDobleNavegacion;
