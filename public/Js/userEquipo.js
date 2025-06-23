async function cargarJugadores() {
    const idEquipo = localStorage.getItem('idEquipo');
    console.log('Cargando jugadores para el equipo con ID:', idEquipo);
    const usuariosList = document.getElementById('jugadores');
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/jugadores/equipo/${idEquipo}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();
        if (!data.success || !data.jugadores || data.jugadores.length === 0) {
            usuariosList.innerHTML = '<p style="color:#edcd3d;">No hay Jugadores.</p>';
            return;
        }
        usuariosList.innerHTML = '';
        for (const jugador of data.jugadores) {
            const card = document.createElement('tr');
            card.innerHTML += `
                <td>${jugador.Usuario.username}</td>
                <td>${jugador.Usuario.name}</td>
                <td>${jugador.Usuario.lastname}</td>
                <td>${jugador.camiseta}</td>
                <td>
                    <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#modalEditar"
                        onclick="cargarDatosEditar('${jugador.Usuario.username}', '${jugador.Usuario.name}', '${jugador.Usuario.lastname}', '${jugador.camiseta}', '${jugador.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#modalEliminar"
                        onclick="prepararEliminarUser('${jugador.id}', '${jugador.Usuario.username}')">Eliminar</button>
                </td>
            `;
            usuariosList.appendChild(card);
        }
    } catch (error) {
        console.error('Error al cargar los jugadores:', error);
        usuariosList.innerHTML = '<p style="color:#edcd3d;">Error al cargar los jugadores</p>';
    }
}