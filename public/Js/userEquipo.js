async function cargarJugadores() {
    const usuariosList = document.getElementById('jugadores');
    const equipo = document.getElementById('equipo');
    try {
        const token = localStorage.getItem('token');

        const resEquipo = await fetch(`/api/jugadores/obtenerEquipoUsuario/`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const idData = await resEquipo.json();

        const idEquipo = idData.id_equipo;
        if (!idEquipo) {
            usuariosList.innerHTML = '<p style="color:#edcd3d;">No hay equipo asociado.</p>';
            return;
        }

        // Paso 2: obtener jugadores del equipo
        const resJugadores = await fetch(`/api/jugadores/equipo/${idEquipo}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await resJugadores.json();

        if (!data.success || !data.jugadores || data.jugadores.length === 0) {
            usuariosList.innerHTML = '<p style="color:#edcd3d;">No hay Jugadores.</p>';
            return;
        }

        usuariosList.innerHTML = '';
        for (const jugador of data.jugadores) {
            const card = document.createElement('tr');
            card.innerHTML = `
                <td>${jugador.Usuario.username}</td>
                <td>${jugador.Usuario.name}</td>
                <td>${jugador.Usuario.lastname}</td>
                <td>${jugador.camiseta}</td>
            `;
            usuariosList.appendChild(card);
        }

        const resp = await fetch(`/api/equipos/obtenerEquipo/${idEquipo}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const dataEquipo = await resp.json();
        equipo.innerHTML =`${dataEquipo.equipo.nombre}`;

    } catch (error) {
        console.error('Error al cargar los jugadores:', error);
        usuariosList.innerHTML = '<p style="color:#edcd3d;">Error al cargar los jugadores</p>';
    }
}