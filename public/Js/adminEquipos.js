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
                <span>${equipo.nombre}</span>
                <button class="btn btn-danger btn-sm" onclick="eliminarEquipo(${equipo.id})">Eliminar</button>
            `;
            equiposList.appendChild(li);
        });
    } else {
        console.error(data.message);
    }
}