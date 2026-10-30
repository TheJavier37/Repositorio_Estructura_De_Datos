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

// 6. Nuevas funcionalidades (Avance 4 - aporte Ricardo)
console.log('\n=== NUEVAS FUNCIONALIDADES ===');
const navExtra = new ListaDobleNavegacion(5); // capacidad máxima: 5 registros
['Inicio', 'Productos', 'Carrito', 'Pago'].forEach((accion, i) =>
  navExtra.insertar({ id: i + 1, accion })
);
console.log('Historial:', navExtra.toArray().map(d => d.accion).join(' <-> '));
console.log('irA(2):', navExtra.irA(2));
console.log('buscar "Pago":', navExtra.buscar(d => d.accion === 'Pago'));
navExtra.irA(1);
navExtra.navegarA({ id: 9, accion: 'Ofertas' }); // descarta Carrito y Pago
console.log('Tras navegarA:', navExtra.toArray().map(d => d.accion).join(' <-> '));
console.log('Invertido:', navExtra.toArray(true).map(d => d.accion).join(' <-> '));

