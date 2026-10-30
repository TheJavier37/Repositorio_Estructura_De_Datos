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

module.exports = { crearPaciente, NIVELES };