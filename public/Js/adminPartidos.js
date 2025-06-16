async function crearPartidoAdmin() {
    const username = document.getElementById('username').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('horario').value;
    const jugadores = document.getElementById('jugadores').value;

    const msgDiv = document.getElementById('message');
    msgDiv.style.display = 'none'; // Oculta el mensaje antes de enviar
    msgDiv.className = "";

    const token = localStorage.getItem('token');
    const res = await fetch('/api/partidos/crearAdmin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ username, fecha, hora, jugadores })
    });
    if (res.status === 401 || res.status === 403) {
        window.location.href = 'login.html';
        return;
    }
    const data = await res.json();
    if (data.success) {
        msgDiv.style.display = 'block';
        msgDiv.className = "alert alert-warning d-flex align-items-center text-center"; // Cambia la clase para aplicar estilos de error
        msgDiv.innerText = data.message;
        setTimeout(() => {
            window.location.href = 'Partidos(admin).html';
    }, 1000);
    } else {
        msgDiv.style.display = 'block';
        msgDiv.className = "alert alert-warning d-flex align-items-center text-center"; // Cambia la clase para aplicar estilos de error
        msgDiv.innerText = data.message;
    }
}

async function mostrarPartidos(){
    const partidosList = document.getElementById('partidosList');
    partidosList.innerHTML = '<p style="color:#edcd3d;">Cargando Partidos...</p>';

    try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/partidos/partidos', {
            headers: {
            'Authorization': `Bearer ${token}`
        }
        });
        const data = await res.json();
        // CORRIGE ESTA CONDICIÓN:
        if (!data.success || !data.partidos || data.partidos.length === 0) {
            partidosList.innerHTML = '<p style="color:#edcd3d;">No hay partidos.</p>';
            return;
        }

        partidosList.innerHTML = '';
        for (const partido of data.partidos) {
            const resUsername = await fetch(`/api/partidos/owner/${partido.id}`);
            const dataUsername = await resUsername.json();
            if (!dataUsername.success) {
                partidosList.innerHTML = '<p style="color:#edcd3d;">Error al Partidoscargar el nombre de usuario.</p>';
                return;
            }
            const username = dataUsername.username;
            let cancha;
            if(!partido.cancha){
                cancha = 'N/A'
            } else {
                cancha = partido.cancha;
            }
            const card = document.createElement('div');
            card.className="m-3";
            card.innerHTML += `
                <div class="card" style="width: 18rem;">
                    <img src="/img/Cómo-hacer-una-cancha-de-fútbol.jpg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <form id="fichajeForm">
                            <input type="hidden" id="id_partido" value="${partido.id}">
                            <h5 class="card-title">${username}</h5>
                            <p class="card-text">Jugadores: ${14-partido.jugadores}/14</p>
                            <p class="card-text">Dia: ${formatearFecha(partido.fecha)}</p>
                            <p class="card-text">Hora: ${partido.hora}</p>
                            <p class="card-text">Cancha: ${cancha}</p>
                            <button type="button" class="btn btn-editar btn-sm" data-bs-toggle="modal" data-bs-target="#editarModal" onclick="abrirEditarPartido(${partido.id}, '${partido.fecha}', '${partido.hora}', ${partido.jugadores})">Editar</button>
                            <button class="btn btn-eliminar btn-sm" onclick="eliminarPartido(${partido.id})">Eliminar</button>
                            <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalConfirmarCancha" onclick="abrirConfirmarCancha(${partido.id})"> Confirmar </button>
                        </form>
                    </div>
                </div>`;
            partidosList.appendChild(card);
        }
    } catch (error) {
        console.error('Error al cargar los partidos:', error);
        partidosList.innerHTML = '<p style="color:#edcd3d;">Error al cargar los partidos</p>';
    }
}
function abrirConfirmarCancha(idPartido) {
    document.getElementById('partidoAConfirmar').value = idPartido;
}

async function eliminarPartido(id_partido) {
    console.log('Botón eliminar presionado. ID partido:', id_partido);
    const msgDiv = document.getElementById('message');
    msgDiv.style.display = 'none'; // Oculta el mensaje antes de enviar
    msgDiv.className = "";

    const token = localStorage.getItem('token');
    const res = await fetch('/api/partidos/eliminar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ id_partido})
    });
    if (res.status === 401 || res.status === 403) {
        window.location.href = 'login.html';
        return;
    }

    const data = await res.json();
    if (data.success) {
        msgDiv.style.display = 'block';
        msgDiv.className = "alert alert-success d-flex align-items-center text-center"; // Cambia la clase para aplicar estilos de éxito
        msgDiv.innerText = data.message;
        setTimeout(() => {
        window.location.reload(); 
        }, 1000);// Recarga la página para reflejar los cambios
    } else {
        msgDiv.style.display = 'block';
        msgDiv.className = "alert alert-warning d-flex align-items-center text-center"; // Cambia la clase para aplicar estilos de error
        msgDiv.innerText = data.message;
    }
}

document.getElementById('formConfirmarCancha').addEventListener('submit', async function(event) {
    event.preventDefault();
    const idPartido = document.getElementById('partidoAConfirmar').value;
    const numeroCancha = document.getElementById('numeroCancha').value;

    const token = localStorage.getItem('token');
    const res = await fetch('/api/partidos/confirmar', {
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

async function modificarPartido() {
    const id_partido = document.getElementById('editarModal').getAttribute('data-id');
    const fecha = document.querySelector('#editarModal #fecha').value;
    const hora = document.querySelector('#editarModal #horario').value;
    const jugadores = document.querySelector('#editarModal #jugadores').value;

    const msgDiv = document.getElementById('message');
    msgDiv.style.display = 'none';
    msgDiv.className = "";

    const token = localStorage.getItem('token');
    const res = await fetch('/api/partidos/modificar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ id_partido, fecha, hora, jugadores })
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

function formatearFecha(fechaISO) {
    if (!fechaISO) return '';
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = String(fecha.getFullYear()).slice(-2);
    return `${dia}/${mes}/${anio}`;
}
window.crearPartidoAdmin = crearPartidoAdmin;

