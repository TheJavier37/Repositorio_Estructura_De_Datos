const Paciente = require('./Paciente.js');

class NodoDoble {
    constructor(dato) {
        this.dato = dato;       // <- Propiedad que busca ListaDobleNavegacion
        this.paciente = dato;   // <- Mantener por compatibilidad si se usaba antes
        this.siguiente = null;
        this.anterior = null;
    }
}

module.exports = NodoDoble;
module.exports.NodoDoble = NodoDoble;
module.exports.NodoPaciente = NodoDoble;