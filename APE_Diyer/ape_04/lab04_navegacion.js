const { ListaDoble } = require('./lab04_lista_doble');

const videos = new ListaDoble();
for (let i = 1; i <= 5; i++) {
    videos.append({ id: i, titulo: `Video ${i}` });
}

videos.imprimirPrimeros(5);
console.log('Actual:', videos.actual.dato.titulo);
console.log('next ->', videos.next().titulo);
console.log('next ->', videos.next().titulo);
console.log('prev ->', videos.prev().titulo);
console.log('prev ->', videos.prev().titulo);
console.log('prev ->', videos.prev().titulo, '(ya está en el primero, no retrocede más)');
