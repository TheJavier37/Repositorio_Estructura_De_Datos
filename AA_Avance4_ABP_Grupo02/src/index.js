const ListaDobleNavegacion = require('./models/ListaDobleNavegacion');
const { crearPaciente } = require('./models/Paciente');

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
// Demuestra: capacidad máxima, toArray, irA, buscar y navegarA.
console.log('\n=== NUEVAS FUNCIONALIDADES ===');
const navExtra = new ListaDobleNavegacion(5); // Capacidad máxima: 5 registros (al pasar de 5 se borra el más antiguo)
['Inicio', 'Productos', 'Carrito', 'Pago'].forEach((accion, i) =>
  navExtra.insertar({ id: i + 1, accion })
);
// toArray() convierte la lista a arreglo; map/join lo muestran como "A <-> B <-> C"
console.log('Historial:', navExtra.toArray().map(d => d.accion).join(' <-> '));
// irA(2): salta a la posición 2 (base 0) => 'Carrito'
console.log('irA(2):', navExtra.irA(2));
// buscar(): halla el primer registro cuya acción sea 'Pago' y mueve el cursor allí
console.log('buscar "Pago":', navExtra.buscar(d => d.accion === 'Pago'));
navExtra.irA(1); // El cursor vuelve a 'Productos' (quedan Carrito y Pago "hacia adelante")
navExtra.navegarA({ id: 9, accion: 'Ofertas' }); // descarta Carrito y Pago
console.log('Tras navegarA:', navExtra.toArray().map(d => d.accion).join(' <-> '));
// toArray(true) recorre desde la cola hacia la cabeza (usa los enlaces 'anterior')
console.log('Invertido:', navExtra.toArray(true).map(d => d.accion).join(' <-> '));

// Cola de revisión de triaje: el personal avanza y retrocede entre pacientes
const cola = new ListaDobleNavegacion();
cola.insertar(crearPaciente({ id: 1, nombre: 'Paciente A', nivel: 2, motivo: 'Dolor torácico' }));
cola.insertar(crearPaciente({ id: 2, nombre: 'Paciente B', nivel: 4, motivo: 'Esguince de tobillo' }));
cola.insertar(crearPaciente({ id: 3, nombre: 'Paciente C', nivel: 3, motivo: 'Fiebre alta' }));

const mostrar = (etiqueta, p) =>
  console.log(`${etiqueta}:`, p ? `${p.nombre} | nivel ${p.nivel} (${p.categoria}) | ${p.motivo}` : 'sin registro');

mostrar('Paciente actual', cola.obtenerActual());
mostrar('Siguiente', cola.avanzar());
mostrar('Siguiente', cola.avanzar());
mostrar('Anterior', cola.retroceder());

console.log('Alta del paciente actual:', cola.eliminarActual());
mostrar('Paciente actual tras el alta', cola.obtenerActual());
console.log('Pacientes en cola:', cola.longitud);
