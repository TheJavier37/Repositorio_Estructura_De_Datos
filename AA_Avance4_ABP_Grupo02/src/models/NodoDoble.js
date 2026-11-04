const { Paciente } = require('./Paciente.js');

class NodoPaciente {
    constructor(paciente) {
        this.paciente = paciente;
        this.siguiente = null;
        this.anterior = null;
    }
}

// Exportamos el nodo para usarlo en otros archivos
module.exports = { NodoPaciente };