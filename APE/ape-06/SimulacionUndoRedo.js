const { PilaTransaccional } = require('./PilaTransaccional');

/**
 * Controlador de Backtracking Operativo con doble pila (pilaDeshacer y pilaRehacer)
 * para garantizar integridad transaccional en servidores de alta energía.
 */
class ControladorServidorEnergia {
    constructor(estadoInicialWatts) {
        this.consumoActualWatts = estadoInicialWatts;
        this.pilaDeshacer = new PilaTransaccional();
        this.pilaRehacer = new PilaTransaccional();
    }

    /**
     * Ejecuta una nueva tarea de servidor modificando el consumo energético.
     * Apila el delta en pilaDeshacer y limpia pilaRehacer (invalida futuros alternativos).
     */
    ejecutarTarea(nombreTarea, nuevoConsumoWatts, loteId) {
        const estadoAnterior = this.consumoActualWatts;
        this.pilaDeshacer.push(nombreTarea, estadoAnterior, nuevoConsumoWatts, loteId);
        this.consumoActualWatts = nuevoConsumoWatts;

        // Toda nueva acción limpia el historial de rehacer
        while (!this.pilaRehacer.estaVacia()) {
            this.pilaRehacer.pop();
        }

        console.log(`[EJECUTAR] ${nombreTarea} | Consumo: ${estadoAnterior}W -> ${nuevoConsumoWatts}W`);
    }

    /**
     * Deshace (Undo) la última operación en O(1) moviendo el delta de pilaDeshacer a pilaRehacer.
     */
    deshacer() {
        if (this.pilaDeshacer.estaVacia()) {
            console.log('[UNDO] No hay operaciones para deshacer.');
            return false;
        }

        const delta = this.pilaDeshacer.pop();
        this.consumoActualWatts = delta.estadoAnterior;
        this.pilaRehacer.push(delta.indice, delta.estadoAnterior, delta.estadoNuevo, delta.loteId);

        console.log(`[UNDO] Revertida '${delta.indice}' | Consumo restaurado: ${delta.estadoNuevo}W -> ${this.consumoActualWatts}W`);
        return true;
    }

    /**
     * Rehace (Redo) la última operación revertida en O(1) moviendo el delta de pilaRehacer a pilaDeshacer.
     */
    rehacer() {
        if (this.pilaRehacer.estaVacia()) {
            console.log('[REDO] No hay operaciones para rehacer.');
            return false;
        }

        const delta = this.pilaRehacer.pop();
        this.consumoActualWatts = delta.estadoNuevo;
        this.pilaDeshacer.push(delta.indice, delta.estadoAnterior, delta.estadoNuevo, delta.loteId);

        console.log(`[REDO] Reaplicada '${delta.indice}' | Consumo restaurado: ${delta.estadoAnterior}W -> ${this.consumoActualWatts}W`);
        return true;
    }

    mostrarEstadoPilas() {
        console.log(`   -> Estado actual: ${this.consumoActualWatts}W | pilaDeshacer: ${this.pilaDeshacer.tamano} | pilaRehacer: ${this.pilaRehacer.tamano}\n`);
    }
}

// --- DEMOSTRACIÓN OPERATIVA ---
console.log('=== SIMULACIÓN DE BACKTRACKING OPERATIVO (UNDO / REDO) ===\n');

const servidor = new ControladorServidorEnergia(450); // Estado base: 450W
servidor.mostrarEstadoPilas();

// 1. Ejecución de secuencia de tareas de alta energía
servidor.ejecutarTarea('TAREA-01: Entrenamiento IA', 1200, 'LOTE-SRV-01');
servidor.ejecutarTarea('TAREA-02: Renderizado 3D', 1850, 'LOTE-SRV-01');
servidor.ejecutarTarea('TAREA-03: Compilación Distribuida', 2100, 'LOTE-SRV-01');
servidor.mostrarEstadoPilas();

// 2. Deshacer dos operaciones por pico térmico (Undo)
servidor.deshacer();
servidor.deshacer();
servidor.mostrarEstadoPilas();

// 3. Rehacer una operación tras estabilizar refrigeración (Redo)
servidor.rehacer();
servidor.mostrarEstadoPilas();