// Author: TheJavier37
const { performance } = require('perf_hooks');

// Historial con límite para evitar fugas de memoria
const historialSatelital = [];
const LIMITE_HISTORIAL = 50; // Constante C, por lo que S(n) = O(1)

console.log("[Auditoría] Iniciando simulación con memoria optimizada...");

function procesarCoordenadaOptimizada() {
  const paquete = {
    timestamp: Date.now(),
    lat: Math.random() * 90,
    lng: Math.random() * 180,
    payload: new Array(100000).fill('datos_topograficos_optimizados')
  };

  historialSatelital.push(paquete);

  // Desvinculación léxica: Eliminamos la referencia al objeto más antiguo
  if (historialSatelital.length > LIMITE_HISTORIAL) {
    historialSatelital.shift(); // Quitamos el primer elemento (FIFO)
  }
}

// Ejecutamos 1000 iteraciones monitoreando la memoria post-GC
for (let i = 1; i <= 1000; i++) {
  procesarCoordenadaOptimizada();

  if (i % 200 === 0) {
    if (global.gc) global.gc(); // Forzamos el GC
    const memoryUsed = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
    console.log(`Iteración ${i} | RAM Controlada: ${memoryUsed} MB`);
  }
}

console.log(`[Auditoría] Finalizado. El arreglo retiene un máximo de ${historialSatelital.length} registros en el Heap.`);