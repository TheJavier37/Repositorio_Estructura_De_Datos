/**
 * Práctica 03 - Tarea 3: Resolución y mantenimiento ecológico (S(n) = O(1))
 * Estructura de Datos - Carrera de Computación, UNL
 *
 * Ejecución: node --expose-gc lab03_solucion.js
 */
const { performance } = require('perf_hooks');

const historialSatelital = [];
const LIMITE_HISTORIAL = 50; // Constante C, por lo que S(n) = O(1)

console.log("[Auditoría] Iniciando versión optimizada (historial acotado)...");
if (!global.gc) {
  console.warn("[Aviso] global.gc no está expuesto. Ejecute con: node --expose-gc lab03_solucion.js");
}
const inicio = performance.now();

/**
 * Procesa un paquete y mantiene un historial FIFO de máximo LIMITE_HISTORIAL registros.
 */
function procesarCoordenadaOptimizada() {
  const paquete = {
    timestamp: Date.now(),
    lat: Math.random() * 90,
    lng: Math.random() * 180,
    payload: new Array(100000).fill('datos_topograficos_optimizados')
  };

  historialSatelital.push(paquete);

  // Desvinculación: eliminamos la referencia al objeto más antiguo (FIFO),
  // de modo que el GC pueda reclamarlo.
  if (historialSatelital.length > LIMITE_HISTORIAL) {
    historialSatelital.shift();
  }
}

for (let i = 1; i <= 1000; i++) {
  procesarCoordenadaOptimizada();

  if (i % 200 === 0) {
    if (global.gc) global.gc(); // Forzamos el GC
    const memoryUsed = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
    console.log(`Iteración ${i} | RAM Controlada: ${memoryUsed} MB | Registros: ${historialSatelital.length}`);
  }
}

console.log(`[Auditoría] Finalizado. El historial retiene ${historialSatelital.length} registros (máx. ${LIMITE_HISTORIAL}).`);
console.log(`[Auditoría] Tiempo total: ${(performance.now() - inicio).toFixed(1)} ms`);
