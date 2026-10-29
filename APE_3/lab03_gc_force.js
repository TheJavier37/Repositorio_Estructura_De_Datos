/**
 * Práctica 03 - Tarea 2: Forzado del Recolector de Basura (Garbage Collector)
 * Estructura de Datos - Carrera de Computación, UNL
 *
 * Ejecución (la bandera expone global.gc): node --expose-gc lab03_gc_force.js
 */
const { performance } = require('perf_hooks');

// Referencia global: raíz que mantiene vivos todos los objetos que contiene.
const historialSatelitalGlobal = [];

console.log("[Auditoría] Iniciando simulación con GC forzado...");
if (!global.gc) {
  console.warn("[Aviso] global.gc no está expuesto. Ejecute con: node --expose-gc lab03_gc_force.js");
}
const inicio = performance.now();

/**
 * Acumula un paquete satelital en el arreglo global (fuga intencional).
 */
function procesarCoordenada() {
  const paquete = {
    timestamp: Date.now(),
    lat: Math.random() * 90,
    lng: Math.random() * 180,
    payload: new Array(100000).fill('datos_topograficos_basura')
  };
  historialSatelitalGlobal.push(paquete);
}

for (let i = 1; i <= 500; i++) {
  procesarCoordenada();

  if (i % 100 === 0) {
    // Si global.gc está expuesto, lo forzamos a limpiar
    if (global.gc) {
      global.gc(); // Barrido manual (Mark-and-Sweep)
    }
    const memoryUsed = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
    console.log(`Iteración ${i} | RAM post-GC: ${memoryUsed} MB`);
  }
}

console.log(`[Auditoría] Finalizado. El arreglo retiene ${historialSatelitalGlobal.length} registros en el Heap.`);
console.log(`[Auditoría] Tiempo total: ${(performance.now() - inicio).toFixed(1)} ms`);
