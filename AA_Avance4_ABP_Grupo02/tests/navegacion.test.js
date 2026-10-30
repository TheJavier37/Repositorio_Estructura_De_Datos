const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const ListaDobleNavegacion = require('../src/models/ListaDobleNavegacion');

describe('Pruebas Unitarias - Navegación Bidireccional (Avance 4 ABP)', () => {
  let lista;

  beforeEach(() => {
    lista = new ListaDobleNavegacion();
    lista.insertar({ id: 101, accion: 'Cargar Vista A' });
    lista.insertar({ id: 102, accion: 'Filtrar Datos B' });
    lista.insertar({ id: 103, accion: 'Exportar Reporte C' });
  });

  test('1. Inicialización: El cursor debe situarse en el primer nodo insertado', () => {
    assert.equal(lista.obtenerActual()?.id || lista.actual?.dato?.id, 101);
    assert.equal(lista.longitud, 3);
  });

  test('2. Avance Secuencial: Debe desplazarse hacia adelante correctamente', () => {
    assert.equal(lista.avanzar()?.id, 102);
    assert.equal(lista.avanzar()?.id, 103);
    assert.equal(lista.avanzar(), null);
  });

  test('3. Retroceso Secuencial: Debe navegar hacia atrás y mantener la consistencia', () => {
    lista.avanzar(); // Cursor en 102
    lista.avanzar(); // Cursor en 103
    assert.equal(lista.retroceder()?.id, 102);
    assert.equal(lista.retroceder()?.id, 101);
    assert.equal(lista.retroceder(), null);
  });

  test('4. Eliminación de Nodo Intermedio: Reconexión correcta de punteros anterior y siguiente', () => {
    lista.avanzar(); // Cursor en 102
    const exito = lista.eliminarActual();
    assert.equal(exito, true);
    assert.equal(lista.longitud, 2);
    assert.equal(lista.obtenerActual()?.id, 103);
    assert.equal(lista.retroceder()?.id, 101);
  });

  test('5. Casos Límite: Manejo seguro sobre estructuras vacías', () => {
    const listaVacia = new ListaDobleNavegacion();
    assert.equal(listaVacia.obtenerActual(), null);
    assert.equal(listaVacia.avanzar(), null);
    assert.equal(listaVacia.retroceder(), null);
    assert.equal(listaVacia.eliminarActual(), false);
  });

  describe('Nuevas funcionalidades', () => {
    test('6. irAlInicio / irAlFinal / estaVacia', () => {
      assert.equal(lista.estaVacia(), false);
      assert.equal(lista.irAlFinal()?.id, 103);
      assert.equal(lista.irAlInicio()?.id, 101);
      assert.equal(new ListaDobleNavegacion().estaVacia(), true);
    });

    test('7. irA(indice): acceso por posición y validación de límites', () => {
      assert.equal(lista.irA(2)?.id, 103);
      assert.equal(lista.irA(0)?.id, 101);
      assert.equal(lista.irA(1)?.id, 102);
      assert.equal(lista.irA(3), null);
      assert.equal(lista.irA(-1), null);
      assert.equal(lista.obtenerActual()?.id, 102);
    });

    test('8. buscar(predicado): mueve el cursor solo si encuentra coincidencia', () => {
      assert.equal(lista.buscar(d => d.id === 103)?.accion, 'Exportar Reporte C');
      assert.equal(lista.buscar(d => d.id === 999), null);
      assert.equal(lista.obtenerActual()?.id, 103);
    });

    test('9. navegarA: descarta el historial hacia adelante (estilo navegador)', () => {
      lista.avanzar();
      lista.navegarA({ id: 200, accion: 'Nueva Pestaña' });
      assert.equal(lista.longitud, 3);
      assert.equal(lista.obtenerActual()?.id, 200);
      assert.equal(lista.avanzar(), null);
      assert.deepEqual(lista.toArray().map(d => d.id), [101, 102, 200]);
      assert.equal(lista.retroceder()?.id, 102);
    });

    test('10. toArray (normal e invertido) mantiene consistencia de punteros', () => {
      assert.deepEqual(lista.toArray().map(d => d.id), [101, 102, 103]);
      assert.deepEqual(lista.toArray(true).map(d => d.id), [103, 102, 101]);
    });

    test('11. Capacidad máxima: descarta el registro más antiguo', () => {
      const acotada = new ListaDobleNavegacion(2);
      acotada.insertar({ id: 1 });
      acotada.insertar({ id: 2 });
      acotada.insertar({ id: 3 });
      assert.equal(acotada.longitud, 2);
      assert.deepEqual(acotada.toArray().map(d => d.id), [2, 3]);
      assert.equal(acotada.obtenerActual()?.id, 2);
      assert.equal(acotada.retroceder(), null);
      assert.throws(() => new ListaDobleNavegacion(0), RangeError);
    });

    test('12. limpiar: deja la estructura vacía y reutilizable', () => {
      lista.limpiar();
      assert.equal(lista.estaVacia(), true);
      assert.equal(lista.obtenerActual(), null);
      lista.insertar({ id: 1 });
      assert.equal(lista.obtenerActual()?.id, 1);
    });
  });
});