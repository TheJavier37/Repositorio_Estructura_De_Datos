const { performance } = require('perf_hooks');
const { ListaSatelital } = require('./lab04_lista_doble');

const N = 100000; // 100 mil registros satelitales

console.log(`[Benchmark] Iniciando inserción de ${N} elementos al INICIO...`);

// PRUEBA 1: ARREGLO NATIVO (desplazamiento de memoria O(n) por inserción)
let arregloHistorial = [];
const startArray = performance.now();
for (let i = 0; i < N; i++) {
  arregloHistorial.unshift({ id: i, lat: 10.5, lng: -79.2 });
}
const endArray = performance.now();
const timeArray = endArray - startArray;
console.log(`[Energía Alta] Arreglo nativo (unshift): ${timeArray.toFixed(2)} ms`);

// PRUEBA 2: LISTA DOBLEMENTE ENLAZADA (asignación de punteros O(1))
let listaHistorial = new ListaSatelital();
const startList = performance.now();
for (let i = 0; i < N; i++) {
  listaHistorial.prepend({ id: i, lat: 10.5, lng: -79.2 });
}
const endList = performance.now();
const timeList = endList - startList;
console.log(`[Energía Baja] Lista Enlazada (prepend): ${timeList.toFixed(2)} ms`);

const multiplicador = (timeArray / timeList).toFixed(1);
console.log(`\n[Auditoría Verde] La lista enlazada es ${multiplicador} veces más rápida.`);
console.log('Ahorro directo de ciclos de CPU y consumo eléctrico en el servidor.');

// Verificación de vinculación (Tarea 3)
listaHistorial.imprimirPrimeros(5);

// Prueba de navegación next()/prev()
listaHistorial.irAlInicio();
console.log('\n[Navegación] cursor inicial:', listaHistorial.actual.dato.id);
console.log('next() ->', listaHistorial.next().id);
console.log('next() ->', listaHistorial.next().id);
console.log('prev() ->', listaHistorial.prev().id);
