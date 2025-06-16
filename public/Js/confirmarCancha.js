document.getElementById('formConfirmarCancha').addEventListener('submit', async function(event) {
    event.preventDefault();
    const idPartido = document.getElementById('partidoAConfirmar').value;
    const numeroCancha = document.getElementById('numeroCancha').value;

    const token = localStorage.getItem('token');
    const res = await fetch('/confirmarPartido', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ id_partido: idPartido, cancha: numeroCancha })
    });
    const data = await res.json();
    if (data.success) {
        window.location.reload();
    } else {
        alert(data.message || 'Error al confirmar partido');
    }
});