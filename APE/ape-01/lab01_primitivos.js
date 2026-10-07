// Autor: TheJavier37 (Javier Guarnizo Vega)
// Tarea 3
const { getMemoryUsage } = require('./profile');
const N = 1000000;

if (global.gc) global.gc();

const memoriaInicial = getMemoryUsage();

// TDA Desacoplado: Uso de Typed Arrays para obligar a V8 a usar memoria contigua
// La capacidad total requerida es N elementos de 8 bytes (64 bits) cada uno
let lat = new Float64Array(N);
let lng = new Float64Array(N);

for (let i = 0; i < N; i++) {
  lat[i] = i * 0.1;
  lng[i] = i * -0.1;
}

if (global.gc) global.gc();

const memoriaFinal = getMemoryUsage();
const consumoNeto = Math.round((memoriaFinal - memoriaInicial) * 100) / 100;

console.log(`[Enfoque Primitivos] Memoria inicial: ${memoriaInicial} MB`);
console.log(`[Enfoque Primitivos] Memoria final: ${memoriaFinal} MB`);
console.log(`[Enfoque Primitivos] Consumo Neto: ${consumoNeto} MB`);