const ListaDobleNavegacion = require('./models/ListaDobleNavegacion');
const { crearPaciente } = require('./models/Paciente');

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