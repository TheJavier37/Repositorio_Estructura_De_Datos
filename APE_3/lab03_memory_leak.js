/**
 * Práctica 03 - Tarea 1: Simulación de una fuga de memoria (Memory Leak)
 * Estructura de Datos - Carrera de Computación, UNL
 *
 * Ejecución: node lab03_memory_leak.js
 */
const { performance } = require('perf_hooks');

// Referencia global: actúa como raíz (root); el GC no puede eliminar lo que esté aquí.
const historialSatelitalGlobal = [];

console.log("[Auditoría] Iniciando simulación de Memory Leak...");
const inicio = performance.now();

/**
 * Simula la llegada de un paquete de datos satelital y lo acumula
 * en el arreglo global sin descartarlo nunca.
 */
function procesarCoordenada() {
  // Paquete entrante (la carga útil es pesada para acelerar el llenado de memoria)
  const paquete = {
    timestamp: Date.now(),
    lat: Math.random() * 90,
    lng: Math.random() * 180,
    payload: new Array(100000).fill('datos_topograficos_basura')
  };

  // El error lógico: almacenamos todo indefinidamente, causando S(n) = O(n)
  historialSatelitalGlobal.push(paquete);
}

// Monitoreo de la memoria Heap cada 100 iteraciones
for (let i = 1; i <= 500; i++) {
  procesarCoordenada();

  if (i % 100 === 0) {
    const memoryUsed = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
    console.log(`Iteración ${i} | RAM consumida: ${memoryUsed} MB`);
  }
}

console.log(`[Auditoría] Finalizado. El arreglo retiene ${historialSatelitalGlobal.length} registros en el Heap.`);
console.log(`[Auditoría] Tiempo total: ${(performance.now() - inicio).toFixed(1)} ms`);
