// Práctica 02 - Tarea 1: Generación del conjunto de datos masivo (Mock Data)
const fs = require('fs');
const { performance } = require('perf_hooks');

const FILE_NAME = 'coordenadas_masivas.csv';
const N = 1000000;

console.log(`[Generador] Iniciando escritura de ${N} registros...`);
const start = performance.now();

// Stream de escritura: los datos se envían al disco por bloques,
// sin construir un único string gigante en memoria.
const writableStream = fs.createWriteStream(FILE_NAME);
writableStream.write('id,latitud,longitud\n'); // Cabecera

for (let i = 0; i < N; i++) {
  const lat = (Math.random() * 180 - 90).toFixed(6);
  const lng = (Math.random() * 360 - 180).toFixed(6);
  // Cada registro es una línea CSV
  writableStream.write(`${i},${lat},${lng}\n`);
}

writableStream.end();

writableStream.on('finish', () => {
  const end = performance.now();
  console.log(`[Generador] Archivo creado en ${((end - start) / 1000).toFixed(2)} segundos.`);

  // Calcular tamaño del archivo en disco
  const stats = fs.statSync(FILE_NAME);
  const sizeInMB = stats.size / (1024 * 1024);
  console.log(`[Generador] Peso físico en disco: ${sizeInMB.toFixed(2)} MB`);
});
