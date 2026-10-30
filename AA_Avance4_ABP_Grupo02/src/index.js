const ListaDobleNavegacion = require('./models/ListaDobleNavegacion');

// Demostración de la navegación bidireccional (Avance 4 ABP - Grupo 02)
const historial = new ListaDobleNavegacion();
historial.insertar({ id: 101, accion: 'Cargar Vista A' });
historial.insertar({ id: 102, accion: 'Filtrar Datos B' });
historial.insertar({ id: 103, accion: 'Exportar Reporte C' });

console.log('Actual:', historial.obtenerActual());
console.log('Avanzar:', historial.avanzar());
console.log('Avanzar:', historial.avanzar());
console.log('Retroceder:', historial.retroceder());
console.log('Eliminar actual:', historial.eliminarActual());
console.log('Actual tras eliminar:', historial.obtenerActual());
console.log('Longitud:', historial.longitud);
