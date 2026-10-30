const ListaDobleNavegacion = require('./models/ListaDobleNavegacion');
const { crearPaciente } = require('./models/Paciente');

console.log('==================================================');
console.log('  SISTEMA DE TRIAJE Y NAVEGACIÓN BIDIRECCIONAL');
console.log('            Avance 4 ABP - Grupo 02');
console.log('==================================================\n');

// ---------------------------------------------------------
// 1. Demostración de Navegación Bidireccional
// ---------------------------------------------------------
console.log('=== 1. DEMOSTRACIÓN DE NAVEGACIÓN EN HISTORIAL ===');
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

// ---------------------------------------------------------
// 2. Funcionalidades de Historial Tipo Navegador
// ---------------------------------------------------------
console.log('\n=== 2. FUNCIONALIDADES TIPO NAVEGADOR Y BÚSQUEDA ===');
const navExtra = new ListaDobleNavegacion(5); // Capacidad máxima: 5 registros
['Inicio', 'Productos', 'Carrito', 'Pago'].forEach((accion, i) =>
  navExtra.insertar({ id: i + 1, accion })
);

console.log('Historial completo:', navExtra.toArray().map(d => d.accion).join(' <-> '));
console.log('irA(2):', navExtra.irA(2));
console.log('buscar "Pago":', navExtra.buscar(d => d.accion === 'Pago'));

navExtra.irA(1); // Regresa a 'Productos'
console.log('Cursor actual antes de navegarA:', navExtra.obtenerActual());
navExtra.navegarA({ id: 9, accion: 'Ofertas' }); // Descarta el historial hacia adelante ('Carrito' y 'Pago')

console.log('Tras navegarA (historial bifurcado):', navExtra.toArray().map(d => d.accion).join(' <-> '));
console.log('Invertido:', navExtra.toArray(true).map(d => d.accion).join(' <-> '));

// ---------------------------------------------------------
// 3. Cola de Revisión de Triaje Hospitalario
// ---------------------------------------------------------
console.log('\n=== 3. COLA DE REVISIÓN DE TRIAJE HOSPITALARIO ===');
const cola = new ListaDobleNavegacion();
cola.insertar(crearPaciente({ id: 1, nombre: 'Paciente A', nivel: 2, motivo: 'Dolor torácico' }));
cola.insertar(crearPaciente({ id: 2, nombre: 'Paciente B', nivel: 4, motivo: 'Esguince de tobillo' }));
cola.insertar(crearPaciente({ id: 3, nombre: 'Paciente C', nivel: 3, motivo: 'Fiebre alta' }));

const mostrar = (etiqueta, p) =>
  console.log(`${etiqueta}:`, p ? `${p.nombre} | Nivel ${p.nivel} (${p.categoria}) | ${p.motivo}` : 'sin registro');

mostrar('Paciente actual', cola.obtenerActual());
mostrar('Siguiente', cola.avanzar());
mostrar('Siguiente', cola.avanzar());
mostrar('Anterior', cola.retroceder());

console.log('Alta del paciente actual:', cola.eliminarActual());
mostrar('Paciente actual tras el alta', cola.obtenerActual());
console.log('Pacientes restantes en cola:', cola.longitud);