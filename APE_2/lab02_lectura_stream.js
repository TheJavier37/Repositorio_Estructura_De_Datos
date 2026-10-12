// Práctica 02 - Tarea 3: Enfoque 2 - Lectura asíncrona con Streams, S(n) = O(1)
const fs = require('fs');
const { performance } = require('perf_hooks');

const FILE_NAME = 'coordenadas_masivas.csv';

console.log(`[Lectura por Stream] Iniciando procesamiento...`);
const memoryBefore = process.memoryUsage().heapUsed;
const start = performance.now();

let totalRegistros = 0;

// Flujo de lectura secuencial no bloqueante: el archivo llega en chunks
// (por defecto 64 KB), por lo que la memoria usada depende del tamaño del
// buffer y no del tamaño del archivo.
const readableStream = fs.createReadStream(FILE_NAME, { encoding: 'utf-8' });

readableStream.on('data', (chunk) => {
  // SUSTENTABILIDAD / GC: AQUÍ se ahorran ciclos del Garbage Collector.
  // Cada chunk es un objeto pequeño y de vida corta: se procesa y queda
  // inalcanzable de inmediato, así que el GC lo libera en una recolección
  // rápida de la generación joven (scavenge), sin tocar un heap grande.
  let lineBreakCount = (chunk.match(/\n/g) || []).length;
  totalRegistros += lineBreakCount;
});

readableStream.on('end', () => {
  const end = performance.now();
  const memoryAfter = process.memoryUsage().heapUsed;

  // Nota: se cuenta también el salto de línea de la cabecera, por lo que
  // el total incluye 1 línea extra (N + 1 saltos en total).
  console.log(`[Lectura por Stream] Total registros procesados: ${totalRegistros}`);
  console.log(`[Lectura por Stream] Tiempo de I/O parcializado: ${((end - start) / 1000).toFixed(2)} segundos.`);
  console.log(`[Lectura por Stream] Consumo Neto de RAM: ${((memoryAfter - memoryBefore) / 1024 / 1024).toFixed(2)} MB`);
});
