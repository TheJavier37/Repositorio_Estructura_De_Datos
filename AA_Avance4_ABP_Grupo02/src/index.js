const ListaDobleNavegacion = require('./models/ListaDobleNavegacion');

console.log('=== DEMOSTRACIÓN DE NAVEGACIÓN BIDIRECCIONAL (AVANCE 4) ===\n');

// 1. Instanciar la lista
const navegacion = new ListaDobleNavegacion();

// 2. Insertar registros
console.log('--- Insertando registros ---');
navegacion.insertar({ id: 101, accion: 'Cargar Vista Principal' });
navegacion.insertar({ id: 102, accion: 'Filtrar Datos de Usuarios' });
navegacion.insertar({ id: 103, accion: 'Exportar Reporte a PDF' });

console.log(`Elemento actual inicial:`, navegacion.obtenerActual());
console.log(`Longitud total de la lista: ${navegacion.longitud}\n`);

// 3. Probar el avance (siguiente)
console.log('--- Probando Avance () ---');
console.log('Avanzar 1:', navegacion.avanzar());
console.log('Avanzar 2:', navegacion.avanzar());
console.log('Avanzar 3 (límite):', navegacion.avanzar());

// 4. Probar el retroceso (anterior)
console.log('\n--- Probando Retroceso () ---');
console.log('Retroceder 1:', navegacion.retroceder());
console.log('Retroceder 2:', navegacion.retroceder());
console.log('Retroceder 3 (límite):', navegacion.retroceder());

// 5. Probar la eliminación del nodo actual
console.log('\n--- Probando Eliminación del Nodo Actual ---');
navegacion.avanzar(); // Movemos el cursor al id: 102
console.log('Cursor antes de eliminar:', navegacion.obtenerActual());

const eliminado = navegacion.eliminarActual();
console.log(`¿Se eliminó con éxito?: ${eliminado}`);
console.log('Nuevo elemento en la posición activa:', navegacion.obtenerActual());
console.log(`Nueva longitud total: ${navegacion.longitud}`);