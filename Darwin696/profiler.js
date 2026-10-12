/**
 * Tarea 1: Utilidad para medir la memoria Heap en Megabytes (MB).
 * El Heap es el espacio de memoria dinámico donde V8 almacena objetos y variables.
 */
function getMemoryUsage() {
  const memoryData = process.memoryUsage();
  // Convertimos de bytes a Megabytes (MB) usando notación matemática estándar
  const heapUsedMB = Math.round(memoryData.heapUsed / 1024 / 1024 * 100) / 100;
  return heapUsedMB;
}

/**
 * Extra: memoria de ArrayBuffers (donde viven los Typed Arrays) en MB.
 * Los Float64Array NO se cuentan en heapUsed, sino en arrayBuffers/external.
 */
function getArrayBuffersUsage() {
  const memoryData = process.memoryUsage();
  return Math.round(memoryData.arrayBuffers / 1024 / 1024 * 100) / 100;
}

module.exports = { getMemoryUsage, getArrayBuffersUsage };
