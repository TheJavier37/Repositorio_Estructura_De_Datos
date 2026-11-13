/**
 * Fundamentación Teórica: Números de Catalan para secuencias válidas de Pila (Stack).
 * Calcula C_n = (2n)! / ((n + 1)! * n!) usando BigInt para evitar desbordamiento
 * y genera/comprueba todas las permutaciones válidas de push/pop.
 */

function factorialBigInt(num) {
    let resultado = 1n;
    for (let i = 2n; i <= BigInt(num); i++) {
        resultado *= i;
    }
    return resultado;
}

/**
 * Calcula el n-ésimo Número de Catalan mediante la fórmula combinatoria cerrada.
 */
function calcularCatalan(n) {
    if (n < 0) return 0n;
    const numerador = factorialBigInt(2 * n);
    const denominador = factorialBigInt(n + 1) * factorialBigInt(n);
    return numerador / denominador;
}

/**
 * Genera y comprueba recursivamente (Backtracking) todas las secuencias válidas
 * de n operaciones push ('P') y n operaciones pop ('O'), garantizando que en ningún
 * instante haya más extracciones que inserciones (invariante de pila no vacía).
 */
function generarSecuenciasValidasPila(n) {
    const secuencias = [];

    function backtrack(secuenciaActual, pushesUsados, popsUsados) {
        if (secuenciaActual.length === 2 * n) {
            secuencias.push(secuenciaActual);
            return;
        }

        // Es válido apilar (push) si aún quedan elementos por ingresar
        if (pushesUsados < n) {
            backtrack(secuenciaActual + 'P', pushesUsados + 1, popsUsados);
        }

        // Solo es válido desapilar (pop) si hay elementos actualmente en la pila
        if (popsUsados < pushesUsados) {
            backtrack(secuenciaActual + 'O', pushesUsados, popsUsados + 1);
        }
    }

    backtrack('', 0, 0);
    return secuencias;
}

// --- EJECUCIÓN Y COMPROBACIÓN ---
console.log('=== VERIFICACIÓN TEÓRICA: NÚMEROS DE CATALAN EN TDA PILA ===\n');

for (let n = 1; n <= 5; n++) {
    const catalanTeorico = Number(calcularCatalan(n));
    const secuenciasGeneradas = generarSecuenciasValidasPila(n);
    const coincide = catalanTeorico === secuenciasGeneradas.length;

    console.log(`n = ${n} operaciones:`);
    console.log(`  - Valor Teórico C_${n}: ${catalanTeorico}`);
    console.log(`  - Secuencias válidas comprobadas: ${secuenciasGeneradas.length} [${coincide ? 'VERIFICADO' : 'ERROR'}]`);
    if (n <= 3) {
        console.log(`  - Permutaciones (P=push, O=pop): ${secuenciasGeneradas.join(', ')}`);
    }
}

console.log(`\nComprobación de escala (n = 15): C_15 = ${calcularCatalan(15).toString()} secuencias válidas.`);