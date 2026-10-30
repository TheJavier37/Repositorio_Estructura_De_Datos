const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const ListaDobleNavegacion = require('../src/models/ListaDobleNavegacion');
const { crearPaciente } = require('../src/models/Paciente');

describe('Integración - Cola de revisión de triaje', () => {
  let cola;

  beforeEach(() => {
    cola = new ListaDobleNavegacion();
    cola.insertar(crearPaciente({ id: 1, nombre: 'A', nivel: 2, motivo: 'Dolor torácico' }));
    cola.insertar(crearPaciente({ id: 2, nombre: 'B', nivel: 4, motivo: 'Esguince' }));
    cola.insertar(crearPaciente({ id: 3, nombre: 'C', nivel: 3, motivo: 'Fiebre' }));
  });

  test('1. Navega entre pacientes en ambos sentidos', () => {
    assert.equal(cola.avanzar().nombre, 'B');
    assert.equal(cola.retroceder().nombre, 'A');
  });

  test('2. Dar de alta al último paciente deja el cursor en el anterior', () => {
    cola.avanzar();
    cola.avanzar();
    assert.equal(cola.eliminarActual(), true);
    assert.equal(cola.obtenerActual().nombre, 'B');
    assert.equal(cola.longitud, 2);
  });

  test('3. Rechaza un nivel de triaje inválido', () => {
    assert.throws(() => crearPaciente({ id: 9, nombre: 'X', nivel: 9, motivo: '-' }), RangeError);
  });
});