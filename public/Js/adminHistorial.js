async function cargarHistorial(){
    const torneosList = document.getElementById('torneos');

    try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/torneos/cargarFinalizados', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();
        if (!data.success || !data.torneos || data.torneos.length === 0) {
            torneosList.innerHTML = '<p style="color:#edcd3d;">No hay Torneos.</p>';
            return;
        }
        if (res.status === 401 || res.status === 403) {
            window.location.href = 'login.html';
            return;
        }
        torneosList.innerHTML = '';
        for (const torneo of data.torneos) {
            const card = document.createElement('tr');
            card.innerHTML += `
            <td>${torneo.nombre}</td>
            <td>${formatearFecha(torneo.fecha_inicio)}</td>
            <td>${formatearFecha(torneo.fecha_inicio)}</td>
            <td>${torneo.campeon}</td>
            <td>
                <button type="button" class="btn btn-primary" onclick="ingresarTorneo(${torneo.id})">Detalle</button>
            </td>
                `;
            torneosList.appendChild(card);
        }
    } catch (error) {
        console.error('Error al cargar los partidos:', error);
        usuariosList.innerHTML = '<p style="color:#edcd3d;">Error al cargar los partidos</p>';
    }
}