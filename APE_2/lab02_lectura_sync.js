// Práctica 02 - Tarea 2: Enfoque 1 - Lectura síncrona (bloqueante), S(n) = O(n)
const fs = require('fs');
const { performance } = require('perf_hooks');

const FILE_NAME = 'coordenadas_masivas.csv';

console.log(`[Lectura Síncrona] Iniciando carga en memoria...`);
const memoryBefore = process.memoryUsage().heapUsed;
const start = performance.now();

// I/O bloqueante: el hilo principal se detiene hasta cargar todo el archivo.
// SUSTENTABILIDAD / GC: aquí se crea UN string de ~tamaño del archivo
// (S(n) = O(n)). Al ser un objeto enorme y de larga vida, el Garbage Collector
// debe recorrerlo y moverlo entre generaciones del heap, gastando ciclos de CPU.
const data = fs.readFileSync(FILE_NAME, 'utf-8');

// SUSTENTABILIDAD / GC: split crea además un arreglo con 10^6 strings pequeños,
// lo que multiplica los objetos que el GC debe rastrear y recolectar.
const lineas = data.split('\n');

const end = performance.now();
const memoryAfter = process.memoryUsage().heapUsed;

console.log(`[Lectura Síncrona] Total registros leídos: ${lineas.length - 1}`);
console.log(`[Lectura Síncrona] Tiempo de I/O + Parsing: ${((end - start) / 1000).toFixed(2)} segundos.`);
console.log(`[Lectura Síncrona] Consumo Neto de RAM: ${((memoryAfter - memoryBefore) / 1024 / 1024).toFixed(2)} MB`);
