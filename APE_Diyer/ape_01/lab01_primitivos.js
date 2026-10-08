// Autor: Diyer Torres

const { getMemoryUsage, getArrayBuffersMB } = require('./profiler');

const N = 1000000;
const memoriaInicial = getMemoryUsage();
const buffersInicial = getArrayBuffersMB();

// TDA Desacoplado: Uso de Typed Arrays para obligar a V8 a usar memoria contigua
// La capacidad total requerida es N elementos de 8 bytes (64 bits) cada uno
let lat = new Float64Array(N);
let lng = new Float64Array(N);

for (let i = 0; i < N; i++) {
    lat[i] = i * 0.1;
    lng[i] = i * -0.1;
}

const memoriaFinal = getMemoryUsage();
const buffersFinal = getArrayBuffersMB();
console.log(`[Enfoque Primitivos] Memoria inicial: ${memoriaInicial} MB`);
console.log(`[Enfoque Primitivos] Memoria final: ${memoriaFinal} MB`);
console.log(`[Enfoque Primitivos] Consumo Neto: ${memoriaFinal - memoriaInicial} MB`);
// Extra: los datos reales viven fuera del heap (ArrayBuffer), ~16 MB esperados
console.log(`[Enfoque Primitivos] ArrayBuffers (extra): ${(buffersFinal - buffersInicial).toFixed(2)} MB`);
