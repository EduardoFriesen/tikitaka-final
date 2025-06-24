async function crearPartido() {
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('horario').value;
    let jugadores = parseInt(document.getElementById('jugadores').value, 10);

    const msgDiv = document.getElementById('message');
    msgDiv.style.display = 'none'; // Oculta el mensaje antes de enviar
    document.getElementById('horario').innerText = horario; // Muestra el horario en el párrafo

    const token = localStorage.getItem('token');
    const res = await fetch('/api/partidos/crear', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`, // si usas autenticación
            'Content-Type': 'application/json'
            },
        body: JSON.stringify({ fecha, hora, jugadores })
    });
    if (res.status === 401 || res.status === 403) {
        window.location.href = 'login.html';
        return;
    }
     if (jugadores < 1 || jugadores > 14) {
        msgDiv.style.display = 'block';
        msgDiv.className = "alert alert-warning d-flex align-items-center text-center";
        msgDiv.innerText = "El número de jugadores debe estar entre 1 y 14.";
        return;
    }
    const data = await res.json();
    if (data.success) {
        window.location.href = 'partidosUsuario.html';
    } else {
        msgDiv.style.display = 'block';
        msgDiv.className = "alert alert-warning d-flex align-items-center text-center"; // Cambia la clase para aplicar estilos de error
        msgDiv.innerText = data.message;
    }
}

async function partidosAjenos(){
    const partidosList = document.getElementById('partidosList');
    partidosList.innerHTML = '<p style="color:#edcd3d;">Cargando Partidos...</p>';

    try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/partidos/ajenos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.status === 401 || res.status === 403) {
            window.location.href = 'login.html';
            return;
        }
        const data = await res.json();
        // CORRIGE ESTA CONDICIÓN:
            if (!data.success || !data.partidos || data.partidos.length === 0) {
                partidosList.innerHTML = '<p style="color:#edcd3d;">No hay partidos.</p>';
                return;
            }

            partidosList.innerHTML = '';
            for (const partido of data.partidos) {
                const token = localStorage.getItem('token'); // O donde guardes tu JWT
                const resUsername = await fetch(`/api/partidos/owner/${partido.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
            });
            const dataUsername = await resUsername.json();
            if (!dataUsername.success) {
                partidosList.innerHTML = '<p style="color:#edcd3d;">Error al cargar el nombre de usuario.</p>';
                return;
            }
            const username = dataUsername.username;
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
                        <form id="fichajeForm" onsubmit="fichaje(${partido.id}); return false;">
                            <input type="hidden" id="id_partido" value="${partido.id}">
                            <h5 class="card-title">${username}</h5>
                            <p class="card-text">Jugadores: ${14-partido.jugadores}/14</p>
                            <p class="card-text">Dia: ${formatearFecha(partido.fecha)}</p>
                            <p class="card-text">Hora: ${partido.hora}</p>
                            <p class="card-text">Cancha: ${cancha}</p>
                            <button type="submit" class="btn btn-primary">Entrar</button>
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

async function partidosUsuario(){
    const partidosList = document.getElementById('partidosList');
    partidosList.innerHTML = '<p style="color:#edcd3d;">Cargando Partidos...</p>';

    try {
        // Obtén el id del usuario logueado
        const token = localStorage.getItem('token');
        const userRes = await fetch('/api/usuarios/mostrarUser', {
            headers: { 'Authorization': 'Bearer ' + token }
        }); 
        if (userRes.status === 401 || userRes.status === 403) {
            window.location.href = 'login.html';
            return;
        }
        const userData = await userRes.json();
        if (!userData.success) {
            partidosList.innerHTML = '<p style="color:#edcd3d;">Error al obtener usuario logueado.</p>';
            return;
        }
        const userLoggedInId = userData.usuario.id;

        const res = await fetch('/api/partidos/propios', {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'}
        });
        if (res.status === 401 || res.status === 403) {
            window.location.href = 'login.html';
            return;
        }
        const data = await res.json();
        if (!data.success || !data.partidos || data.partidos.length === 0) {
            partidosList.innerHTML = '<p style="color:#edcd3d;">No hay partidos.</p>';
            return;
        }

        partidosList.innerHTML = '';
        for (const partido of data.partidos) {
            const resUsername = await fetch(`/api/partidos/owner/${partido.id}`);
            const dataUsername = await resUsername.json();
            if (!dataUsername.success) {
                partidosList.innerHTML = '<p style="color:#edcd3d;">Error al cargar el nombre de usuario.</p>';
                return;
            }
            const username = dataUsername.username;
            const card = document.createElement('div');
            card.className="m-3";
            if(!partido.cancha){
                cancha = 'N/A'
            } else {
                cancha = partido.cancha;
            }
            let botones = '';
            if (partido.owner == userLoggedInId) {
                botones = `
                    <button style = "color : white; background-color: green;" type="button" class="btn btn-editar btn-sm" data-bs-toggle="modal" data-bs-target="#editarModal" onclick="abrirEditarPartido(${partido.id}, '${partido.fecha}', '${partido.hora}', ${partido.jugadores})">Editar</button>
                    <button style = "color : white; background-color: blue;" class="btn btn-eliminar btn-sm" onclick="eliminarPartido(${partido.id})">Eliminar</button>
                `;
            } else {
                botones = `
                    <button class="btn btn-secondary m-1" onclick="salirPartido(${partido.id})">Salir</button>
                `;
            }

            card.innerHTML += `
                <div class="card" style="width: 18rem;">
                    <img src="/img/Cómo-hacer-una-cancha-de-fútbol.jpg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${username}</h5>
                        <p class="card-text">Jugadores: ${14-partido.jugadores}/14</p>
                        <p class="card-text">Dia: ${formatearFecha(partido.fecha)}</p>
                        <p class="card-text">Hora: ${partido.hora}</p>
                        <p class="card-text">Cancha: ${cancha}</p>
                        ${botones}
                    </div>
                </div>`;
            partidosList.appendChild(card);
        }
    } catch (error) {
        console.error('Error al cargar los partidos:', error);
        partidosList.innerHTML = '<p style="color:#edcd3d;">Error al cargar los partidos</p>';
    }
}

async function fichaje(id_partido){
    const token = localStorage.getItem('token');
    const res = await fetch('/api/turnos/fichar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ id_partido })
    });
    if (res.status === 401 || res.status === 403) {
        window.location.href = 'login.html';
        return;
    }
    data = await res.json();
    const msgDiv = document.getElementById('message');
    msgDiv.style.display = 'block';
    if (data.success) {
        msgDiv.className = "alert alert-success d-flex align-items-center text-center"; // Cambia la clase para aplicar estilos de éxito
        msgDiv.innerText = data.message;
        setTimeout(() => {
            window.location.reload();
        }, 2000); // Redirige después de 2 segundos
    } else {
        msgDiv.className = "alert alert-warning d-flex align-items-center text-center"; // Cambia la clase para aplicar estilos de error
        msgDiv.innerText = data.message;
    }
}

async function modificarPartido() {
    const id_partido = document.getElementById('editarModal').getAttribute('data-id');
    const fecha = document.querySelector('#editarModal #fecha').value;
    const hora = document.querySelector('#editarModal #horario').value;
    const jugadores = document.querySelector('#editarModal #jugadores').value;
    console.log(id_partido, fecha, horario,jugadores);
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

async function eliminarPartido(id_partido) {
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

async function salirPartido(id_partido) {

    const msgDiv = document.getElementById('message');
    msgDiv.style.display = 'none'; // Oculta el mensaje antes de enviar
    msgDiv.className = "";
    const token = localStorage.getItem('token');
    const res = await fetch('/api/turnos/salir', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ id_partido })
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
        }, 2000); // Redirige después de 2 segundos
    } else {
        msgDiv.style.display = 'block';
        msgDiv.className = "alert alert-warning d-flex align-items-center text-center"; // Cambia la clase para aplicar estilos de error
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

window.eliminarPartido = eliminarPartido;
window.salirPartido = salirPartido;
window.modificarPartido = modificarPartido;
window.fichaje = fichaje;
window.crearPartido = crearPartido;