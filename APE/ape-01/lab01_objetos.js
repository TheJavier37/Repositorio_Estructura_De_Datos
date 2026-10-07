// Autor: TheJavier37 (Javier Guarnizo Vega)
// Tarea 2
const { getMemoryUsage } = require('./profile');
const N = 1000000; // 1 millón de registros

// Forzar Garbage Collection si está habilitado para limpiar remanentes
if (global.gc) global.gc();

const memoriaInicial = getMemoryUsage();

class CoordenadaObj {
  constructor(lat, lng) {
    this.lat = lat;
    this.lng = lng;
  }
}

let coordenadas = [];
for (let i = 0; i < N; i++) {
  coordenadas.push(new CoordenadaObj(i * 0.1, i * -0.1));
}

if (global.gc) global.gc();

const memoriaFinal = getMemoryUsage();
const consumoNeto = Math.round((memoriaFinal - memoriaInicial) * 100) / 100;

console.log(`[Enfoque Objetos] Memoria inicial: ${memoriaInicial} MB`);
console.log(`[Enfoque Objetos] Memoria final: ${memoriaFinal} MB`);
console.log(`[Enfoque Objetos] Consumo Neto: ${consumoNeto} MB`);