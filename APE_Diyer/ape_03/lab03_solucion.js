/**
 * Tarea 3: Resolución y mantenimiento ecológico, S(n) = O(1).
 * Ejecutar con: node --expose-gc lab03_solucion.js
 * Se mantiene un historial acotado a LIMITE_HISTORIAL registros (cola FIFO).
 */
const historialSatelital = [];
const LIMITE_HISTORIAL = 50; // Constante C, por lo que S(n) = O(1)

function procesarCoordenadaOptimizada() {
    const paquete = {
        timestamp: Date.now(),
        lat: Math.random() * 90,
        lng: Math.random() * 180,
        payload: new Array(100000).fill('datos_topograficos_optimizados')
    };

    historialSatelital.push(paquete);

    // Desvinculación léxica: eliminamos la referencia al objeto más antiguo.
    // Al quedar sin referencias, el GC puede reclamar su memoria.
    if (historialSatelital.length > LIMITE_HISTORIAL) {
        historialSatelital.shift(); // Quitamos el primer elemento (FIFO)
    }
}

for (let i = 1; i <= 1000; i++) {
    procesarCoordenadaOptimizada();

    if (i % 200 === 0) {
        if (global.gc) global.gc(); // Forzamos el GC
        const memoryUsed = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
        console.log(`Iteración ${i} | RAM Controlada: ${memoryUsed} MB`);
    }
}
