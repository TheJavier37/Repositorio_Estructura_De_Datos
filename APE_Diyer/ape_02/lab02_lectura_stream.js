const fs = require('fs');
const { performance } = require('perf_hooks');

const FILE_NAME = 'coordenadas_masivas.csv';

console.log(`[Lectura por Stream] Iniciando procesamiento...`);
const memoryBefore = process.memoryUsage().heapUsed;
const start = performance.now();

let totalRegistros = 0;

// Creamos un flujo de lectura secuencial no bloqueante
// Por defecto el buffer interno es de 64 KB -> S(n) = O(1)
const readableStream = fs.createReadStream(FILE_NAME, { encoding: 'utf-8' });

readableStream.on('data', (chunk) => {
    // Procesamos el chunk de datos actual sin almacenarlo completo
    // GC: ZONA DE AHORRO. Cada chunk (~64 KB) se descarta al terminar este callback,
    // así el GC solo recolecta objetos pequeños de vida corta (Scavenge barato)
    // en lugar de un heap gigante.
    // Contamos cuántos saltos de línea hay en este fragmento
    let lineBreakCount = (chunk.match(/\n/g) || []).length;
    totalRegistros += lineBreakCount;
});

readableStream.on('end', () => {
    const end = performance.now();
    const memoryAfter = process.memoryUsage().heapUsed;

    console.log(`[Lectura por Stream] Total registros procesados: ${totalRegistros}`);
    console.log(`[Lectura por Stream] Tiempo de I/O parcializado: ${((end - start) / 1000).toFixed(2)} segundos.`);
    console.log(`[Lectura por Stream] Consumo Neto de RAM: ${((memoryAfter - memoryBefore) / 1024 / 1024).toFixed(2)} MB`);
});
