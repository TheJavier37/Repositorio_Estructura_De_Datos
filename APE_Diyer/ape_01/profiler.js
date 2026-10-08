// Autor: Diyer Torres

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
 * Extra (opcional): memoria de ArrayBuffers (fuera del heap de V8).
 * Los Float64Array guardan sus datos aquí, por eso heapUsed casi no cambia.
 */
function getArrayBuffersMB() {
    const { arrayBuffers } = process.memoryUsage();
    return Math.round(arrayBuffers / 1024 / 1024 * 100) / 100;
}

module.exports = { getMemoryUsage, getArrayBuffersMB };
