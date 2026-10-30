const NIVELES = {
  1: 'Resucitación',
  2: 'Emergencia',
  3: 'Urgencia',
  4: 'Urgencia menor',
  5: 'Sin urgencia',
};

/**
 * Crea un registro de paciente para el módulo de triaje.
 */
function crearPaciente({ id, nombre, nivel, motivo }) {
  if (!NIVELES[nivel]) {
    throw new RangeError(`Nivel de triaje inválido: ${nivel}`);
  }
  return { id, nombre, nivel, categoria: NIVELES[nivel], motivo };
}

/** @typedef {1 | 2 | 3 | 4 | 5} NivelESI */

/**
 * @typedef {Object} SignosVitales
 * @property {number} frecuenciaCardiaca - En pulsaciones por minuto (bpm).
 * @property {number} saturacionOxigeno - Porcentaje SpO2.
 * @property {number} presionArterialSistolica - En mmHg.
 * @property {number} temperatura - En grados Celsius.
 */

/**
 * @typedef {Object} Paciente
 * @property {string} id
 * @property {string} nombre
 * @property {number} edad
 * @property {NivelESI} esiBase
 * @property {SignosVitales} signosVitales
 * @property {number} priorityScore
 * @property {Date} fechaIngreso
 */

/**
 * Calcula la puntuación de prioridad.
 * A mayor puntaje, mayor es la urgencia médica del paciente.
 * @param {NivelESI} esi
 * @param {SignosVitales} vitales
 * @returns {number}
 */
function calcularPriorityScore(esi, vitales) {
  // Inversión de la escala ESI: ESI 1 = 100 pts, ESI 5 = 20 pts.
  let puntuacion = (6 - esi) * 20;

  // Penalizaciones por signos vitales alterados.
  if (vitales.saturacionOxigeno < 88) {
    puntuacion += 30;
  }
  if (vitales.frecuenciaCardiaca > 130 || vitales.frecuenciaCardiaca < 40) {
    puntuacion += 25;
  }
  if (vitales.presionArterialSistolica < 90) {
    puntuacion += 20;
  }

  return puntuacion;
}

module.exports = { crearPaciente, NIVELES, calcularPriorityScore };