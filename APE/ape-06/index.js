const { PilaTransaccional } = require('./PilaTransaccional');

// Estado inicial simulado (ej. lecturas de sensores o registros)
const registros = ['Activo', 'Activo', 'Activo'];
const historialCambios = new PilaTransaccional();

console.log('Estado inicial:', registros);

// --- SIMULACIÓN DE TRANSACCIONES (PUSH) ---
// Cambio 1: Índice 1 pasa de 'Activo' a 'Inactivo'
historialCambios.push(1, registros[1], 'Inactivo', 'LOTE-001');
registros[1] = 'Inactivo';

// Cambio 2: Índice 2 pasa de 'Activo' a 'Mantenimiento'
historialCambios.push(2, registros[2], 'Mantenimiento', 'LOTE-001');
registros[2] = 'Mantenimiento';

console.log('Estado tras modificaciones:', registros);
console.log('Total de deltas en pila:', historialCambios.tamano);
console.log('Último cambio registrado (peek):', historialCambios.peek());

// --- REVERSIÓN DE CAMBIOS / UNDO (POP) ---
console.log('\n--- Ejecutando Rollback ---');
while (!historialCambios.estaVacia()) {
    const delta = historialCambios.pop();
    registros[delta.indice] = delta.estadoAnterior;
    console.log(`Revertido índice [${delta.indice}]: '${delta.estadoNuevo}' -> '${delta.estadoAnterior}' (Lote: ${delta.loteId})`);
}

console.log('\nEstado final restaurado:', registros);
console.log('¿Pila vacía?:', historialCambios.estaVacia());