async function crearEquipo() {
    const nombre = document.getElementById('nombreEquipo').value;
    const msgDiv = document.getElementById('message');
    msgDiv.style.display = 'none';
    msgDiv.className = "";

    const token = localStorage.getItem('token');
    const res = await fetch('/api/equipos/crearEquipo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ nombre })
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

async function cargarEquipos() {
    const equiposList = document.getElementById('equiposList');
    try{
        const token = localStorage.getItem('token');
        const res = await fetch('/api/equipos/obtenerEquipos', {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.status === 401 || res.status === 403) {
            window.location.href = 'login.html';
        return;
        }
        const data = await res.json();
         if (!data.success || !data.equipos || data.equipos.length === 0) {
            equiposList.innerHTML = '<p style="color:#edcd3d;">No hay Equipos.</p>';
            return;
        }
        equiposList.innerHTML = '';
        for(const equipo of data.equipos) {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML += `
                <div class="card" style="width: 18rem;">
                    <img src="/img/Cómo-hacer-una-cancha-de-fútbol.jpg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <form id="fichajeForm">
                            <input type="hidden" id="id_equipo" value="${equipo.id}">
                            <h5 class="card-title">${equipo.nombre}</h5>
                            <button type="button" class="btn btn-editar btn-sm" data-bs-toggle="modal" data-bs-target="#editarModal" onclick="cargarModificar('${equipo.nombre}','${equipo.id}')">Editar</button>
                            <button type="button" class="btn btn-jugadores btn-sm" onclick="jugadores('${equipo.id}')">Jugadores</button>
                            <button type="button" class="btn btn-eliminar btn-sm" data-bs-toggle="modal" data-bs-target="#eliminarModal" onclick="cargarEliminar('${equipo.nombre}','${equipo.id}')">Eliminar</button>
                        </form>
                    </div>
                </div>`;
                equiposList.appendChild(li);
        }
    } catch (error) {
        console.error('Error al cargar los partidos:', error);
        partidosList.innerHTML = '<p style="color:#edcd3d;">Error al cargar los partidos</p>';
    }
}
    
function cargarModificar(nombre, id) {
    document.getElementById('modName').value = nombre;
    document.getElementById('modId').value = id;
}

async function editarEquipo() {
    const id = document.getElementById('modId').value;
    const nombre = document.getElementById('modName').value;

    const msgDiv = document.getElementById('message');
    msgDiv.style.display = 'none';
    msgDiv.className = "";

    const token = localStorage.getItem('token');
    const res = await fetch(`/api/equipos/actualizarEquipo/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ nombre })
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

function cargarEliminar(nombre, id) {
    document.getElementById('delName').textContent = nombre;
    document.getElementById('delId').value = id;
}

function eliminarEquipo() {
    const id = document.getElementById('delId').value;
    const msgDiv = document.getElementById('message');
    msgDiv.style.display = 'none';
    msgDiv.className = "";

    const token = localStorage.getItem('token');
    fetch(`/api/equipos/eliminarEquipo/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(res => {
        if (res.status === 401 || res.status === 403) {
            window.location.href = 'login.html';
            return;
        }
        return res.json();
    }).then(data => {
        if (data.success) {
            window.location.reload();
        } else {
            msgDiv.style.display = 'block';
            msgDiv.className = "alert alert-warning d-flex align-items-center text-center";
            msgDiv.innerText = data.message;
        }
    }).catch(error => {
        console.error('Error al eliminar el equipo:', error);
        msgDiv.style.display = 'block';
        msgDiv.className = "alert alert-danger d-flex align-items-center text-center";
        msgDiv.innerText = 'Error al eliminar el equipo';
    });
}

async function jugadores(idEquipo) {
    localStorage.setItem('idEquipo', idEquipo);
    window.location.href = '/Views/Admin/plantel(admin).html';
}


