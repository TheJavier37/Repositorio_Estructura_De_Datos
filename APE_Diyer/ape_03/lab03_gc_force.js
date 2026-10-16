/**
 * Tarea 2: Forzado del Recolector de Basura (Garbage Collector).
 * Ejecutar con: node --expose-gc lab03_gc_force.js
 * Resultado esperado: la RAM sigue creciendo aun después de gc(), porque
 * historialSatelitalGlobal mantiene referencias activas (Mark-and-Sweep las marca "en uso").
 */
const { performance } = require('perf_hooks');

// Referencia global: raíz que impide la liberación de los paquetes.
const historialSatelitalGlobal = [];

console.log("[Auditoría] Iniciando simulación de Memory Leak con GC forzado...");

function procesarCoordenada() {
    const paquete = {
        timestamp: Date.now(),
        lat: Math.random() * 90,
        lng: Math.random() * 180,
        payload: new Array(100000).fill('datos_topograficos_basura')
    };
    historialSatelitalGlobal.push(paquete); // Fuga: nunca se elimina nada
}

for (let i = 1; i <= 500; i++) {
    procesarCoordenada();

    if (i % 100 === 0) {
        // Si global.gc está expuesto, lo forzamos a limpiar
        if (global.gc) {
            global.gc(); // Ejecutamos el barrido manual
        } else {
            console.warn("[Aviso] Ejecute con: node --expose-gc lab03_gc_force.js");
        }
        const memoryUsed = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
        console.log(`Iteración ${i} | RAM post-GC: ${memoryUsed} MB`);
    }
}

console.log(`[Auditoría] Finalizado. El arreglo retiene ${historialSatelitalGlobal.length} registros en el Heap.`);
