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
    if (data.success) {
        const equiposList = document.getElementById('equiposList');
        equiposList.innerHTML = '';
        data.equipos.forEach(equipo => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <div class="card" style="width: 18rem;">
                    <img src="/img/Cómo-hacer-una-cancha-de-fútbol.jpg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <form id="fichajeForm">
                            <input type="hidden" id="id_partido" value="${equipo.id}">
                            <h5 class="card-title">${equipo.nombre}</h5>
                            <button class="btn btn-editar btn-sm" onclick="editarEquipo(${equipo.id})">Editar</button>
                            <button class="btn btn-jugadores btn-sm" onclick="jugadoresEquipo(${equipo.id})">Jugadores</button>
                            <button class="btn btn-eliminar btn-sm" onclick="eliminarEquipo(${equipo.id})">Eliminar</button>
                        </form>
                    </div>
                </div>`;
            equiposList.appendChild(li);
        });
    } else {
        console.error(data.message);
    }
}