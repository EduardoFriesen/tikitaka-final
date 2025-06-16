function abrirEditarPartido(id, fecha, hora, jugadores) {
    // Llenar los campos del modal con los datos del partido
    document.querySelector('#editarModal #jugadores').value = jugadores;
    document.querySelector('#editarModal #fecha').value = fecha;
    document.querySelector('#editarModal #horario').value = hora;
    // Guarda el id en un atributo del modal para usarlo luego
    document.getElementById('editarModal').setAttribute('data-id', id);
}

function abrirConfirmarCancha(idPartido) {
    document.getElementById('partidoAConfirmar').value = idPartido;
}

