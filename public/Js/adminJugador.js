async function fichar() {
    const username = document.getElementById('username').value;
    const camiseta = document.getElementById('camiseta').value;
    const idEquipo = localStorage.getItem('idEquipo'); // Asegúrate de que este ID esté disponible

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/jugadores/fichar/${idEquipo}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ username, camiseta })
        });

        if (res.status === 401 || res.status === 403) {
            window.location.href = 'login.html';
            return;
        }

        const data = await res.json();
        if (!data.success) {
            console.error('Error al fichar jugador:', data.message);
            return;
        }

        alert('Jugador fichado correctamente');
        cargarJugadores();
        document.getElementById('ficharModal').modal('hide');
    } catch (error) {
        console.error('Error al fichar jugador:', error);
    }
}

async function cargarEquipo(){
    const idEquipo = localStorage.getItem('idEquipo');
    console.log('Cargando equipo con ID:', idEquipo);
    const equipoElement = document.getElementById('equipo');
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/equipos/obtenerEquipo/${idEquipo}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (res.status === 401 || res.status === 403) {
            window.location.href = 'login.html';
            return;
        }
        const data = await res.json();
        if (!data.success || !data.equipo) {
            equipoElement.innerHTML = '<p style="color:#edcd3d;">Equipo no encontrado.</p>';
            return;
        }
        equipoElement.textContent = data.equipo.nombre;
    }
    catch (error) {
        console.error('Error al cargar el equipo:', error);
        equipoElement.innerHTML = '<p style="color:#edcd3d;">Error al cargar el equipo</p>';
    }
    cargarJugadores();
}

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

async function cargarDatosEditar(username, name, lastname, camiseta, id) {
    document.getElementById('modUsername').value = username;
    document.getElementById('modName').value = name;
    document.getElementById('modLastname').value = lastname;
    document.getElementById('modCamiseta').value = camiseta;
    document.getElementById('modId').value = id;
}
async function editarJugador() {
    const id_equipo = localStorage.getItem('idEquipo');
    const id = document.getElementById('modId').value;
    const camiseta = document.getElementById('modCamiseta').value;
    const msgDiv = document.getElementById('message');
    msgDiv.style.display = 'none';
    msgDiv.className = "";

    const token = localStorage.getItem('token');
    const res = await fetch(`/api/jugadores/actualizarJugador/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ id_equipo, camiseta })
    });

    if (res.status === 401 || res.status === 403) {
        window.location.href = 'login.html';
        return;
    }

    const data = await res.json();
    if (data.success) {
        window.location.reload();
    } else {
        msgDiv.style.display = 'block';
        msgDiv.className = "alert alert-warning d-flex align-items-center text-center";
        msgDiv.innerText = data.message;
    }
}
async function prepararEliminarUser(id, username) {
    document.getElementById('delName').textContent = username;
    document.getElementById('delId').value = id;
}
async function eliminarJugador() {
    const id = document.getElementById('delId').value;
    const msgDiv = document.getElementById('message');
    msgDiv.style.display = 'none';
    msgDiv.className = "";

    const token = localStorage.getItem('token');
    const res = await fetch(`/api/jugadores/eliminarJugador/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });

    if (res.status === 401 || res.status === 403) {
        window.location.href = 'login.html';
        return;
    }

    const data = await res.json();
    if (data.success) {
        window.location.reload();
    } else {
        msgDiv.style.display = 'block';
        msgDiv.className = "alert alert-warning d-flex align-items-center text-center";
        msgDiv.innerText = data.message;
    }
}