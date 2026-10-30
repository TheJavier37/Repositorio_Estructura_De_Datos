const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

// Importaciones desde la ruta src/models/
const ListaDobleNavegacion = require('../src/models/ListaDobleNavegacion');
const PacienteModulo = require('../src/models/Paciente');

// Compatibilidad: Permite usar crearPaciente sea exportación nombrada, clase o función directa
const crearPaciente = (datos) => {
  if (typeof PacienteModulo.crearPaciente === 'function') {
    return PacienteModulo.crearPaciente(datos);
  }
  if (typeof PacienteModulo === 'function') {
    // Si PacienteModulo es una clase o función constructora
    try {
      return new PacienteModulo(datos);
    } catch {
      return PacienteModulo(datos);
    }
  }
  return datos;
};

describe('Integración - Cola de revisión de triaje', () => {
  let cola;

  beforeEach(() => {
    cola = new ListaDobleNavegacion();
    cola.insertar(crearPaciente({ id: 1, nombre: 'A', nivel: 2, motivo: 'Dolor torácico' }));
    cola.insertar(crearPaciente({ id: 2, nombre: 'B', nivel: 4, motivo: 'Esguince' }));
    cola.insertar(crearPaciente({ id: 3, nombre: 'C', nivel: 3, motivo: 'Fiebre' }));
  });

  test('1. Navega entre pacientes en ambos sentidos', () => {
    assert.equal(cola.avanzar()?.nombre, 'B');
    assert.equal(cola.retroceder()?.nombre, 'A');
  });

  test('2. Dar de alta al último paciente deja el cursor en el anterior', () => {
    cola.avanzar(); // Va a 'B'
    cola.avanzar(); // Va a 'C' (último nodo)
    assert.equal(cola.eliminarActual(), true);
    
    // Al eliminar el último nodo ('C'), el cursor debe reubicarse en el anterior ('B')
    assert.equal(cola.obtenerActual()?.nombre, 'B');
    assert.equal(cola.longitud, 2);
  });

  test('3. Rechaza un nivel de triaje inválido', () => {
    // Verifica que se lance un error si el nivel de triaje está fuera del rango (ej. 1-5)
    assert.throws(
      () => crearPaciente({ id: 9, nombre: 'X', nivel: 9, motivo: '-' }),
      (err) => err instanceof RangeError || err instanceof Error
    );
  });
});