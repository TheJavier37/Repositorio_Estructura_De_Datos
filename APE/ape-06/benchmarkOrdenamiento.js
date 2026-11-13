const { performance } = require('perf_hooks');
const GestorOrdenamientoTransaccional = require('./GestorOrdenamientoTransaccional');

// 1. Generar N = 100,000 nodos energéticos ordenados ascendentemente
const N = 100000;
const datosBase = Array.from({ length: N }, (_, idx) => ({
    id: `NODO-${idx + 1}`,
    watts: (idx + 1) * 10
}));

console.log(`=== PRUEBA COMPARATIVA DE RECUPERACIÓN (N = ${N.toLocaleString()} nodos) ===\n`);

// --- PRUEBA ESTRATEGIA A: TRANSACCIONAL LIFO O(m) ---
const gestorA = new GestorOrdenamientoTransaccional(datosBase);
const loteId = 'LOTE-FALLO-99';

// Simulamos m actualizaciones en el lote (ej. 5 nodos sufren caídas de voltaje)
gestorA.actualizarConRegistroDelta(500, 15, loteId);
gestorA.actualizarConRegistroDelta(1200, 45, loteId);
gestorA.actualizarConRegistroDelta(2500, 80, loteId);
gestorA.actualizarConRegistroDelta(4000, 110, loteId);
gestorA.actualizarConRegistroDelta(6000, 200, loteId);

const inicioA = performance.now();
const deltasRevertidos = gestorA.deshacerLoteTransaccional(loteId);
const finA = performance.now();
const tiempoA = (finA - inicioA).toFixed(4);

console.log(`[Estrategia A - Transaccional LIFO O(m)]`);
console.log(`- Deltas revertidos (m): ${deltasRevertidos}`);
console.log(`- Tiempo de recuperación: ${tiempoA} ms`);
console.log(`- Orden verificado (primeros 3):`, gestorA.registros.slice(0, 3));

// --- PRUEBA ESTRATEGIA B: RE-PROCESAMIENTO COMPLETO O(N log N) ---
const gestorB = new GestorOrdenamientoTransaccional(datosBase);

// Aplicamos las mismas mutaciones que fallaron
gestorB.actualizarConRegistroDelta(500, 15, loteId);
gestorB.actualizarConRegistroDelta(1200, 45, loteId);
gestorB.actualizarConRegistroDelta(2500, 80, loteId);
gestorB.actualizarConRegistroDelta(4000, 110, loteId);
gestorB.actualizarConRegistroDelta(6000, 200, loteId);

const inicioB = performance.now();
// En Estrategia B se restauran valores base y se reordena todo el conjunto N
gestorB.registros = datosBase.map(item => ({ ...item }));
gestorB.reprocesarOrdenamientoCompleto();
const finB = performance.now();
const tiempoB = (finB - inicioB).toFixed(4);

console.log(`\n[Estrategia B - Re-procesamiento Completo O(N log N)]`);
console.log(`- Registros re-procesados (N): ${N.toLocaleString()}`);
console.log(`- Tiempo de recuperación: ${tiempoB} ms`);
console.log(`- Orden verificado (primeros 3):`, gestorB.registros.slice(0, 3));

// --- RESULTADO COMPARATIVO ---
const speedup = (parseFloat(tiempoB) / Math.max(parseFloat(tiempoA), 0.0001)).toFixed(2);
console.log(`\n>>> Conclusión: La Estrategia A (LIFO) fue ~${speedup}x más rápida que el re-procesamiento completo.`);