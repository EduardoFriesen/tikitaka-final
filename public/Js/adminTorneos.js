async function cargar() {
    const idTorneo = localStorage.getItem('idTorneo');
    if (!idTorneo) {
        alert('No se ha seleccionado un torneo. Por favor, selecciona un torneo primero.');
        return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/Views/Login/login.html';
        return;
    }
    try {
        const res = await fetch(`/api/torneos/obtenerTorneo/${idTorneo}`, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${token}`
            }
        });
        if (res.status === 401 || res.status === 403) {
            window.location.href = '/Views/Login/login.html';
            return;
        }
        const data = await res.json();
        if (!data.success) {
            alert('Error al cargar el torneo: ' + data.message);
            return;
        }
        document.getElementById('torneo').textContent = data.torneo.nombre;
        document.getElementById('fechaInicio').textContent = formatearFecha(data.torneo.fecha_inicio);
        document.getElementById('fechaFin').textContent = formatearFecha(data.torneo.fecha_fin);
        document.getElementById('idTorneo').value = idTorneo;
    } catch (error) {
        console.error('Error al cargar el torneo:', error);
        alert('Ocurrió un error al cargar el torneo. Inténtalo de nuevo más tarde.');
    }
}

async function crearTorneo() {
    const nombre = document.getElementById('nombre').value;
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    
    if (!nombre || !fechaInicio || !fechaFin) {
        alert('Por favor, completa todos los campos.');
        return;
    }
    if (new Date(fechaInicio) >= new Date(fechaFin)) {
        alert('La fecha de inicio debe ser anterior a la fecha de finalización.');
        return;
    }

    if (new Date(fechaInicio) < new Date()) {
        alert('La fecha de inicio no puede ser anterior a la fecha actual.');
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/torneos/crearTorneo', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, fecha_inicio: fechaInicio, fecha_fin: fechaFin })
        });

        const data = await response.json();
        if (data.success) {
            alert('Torneo creado exitosamente');
            location.reload();
        } else {
            alert(`Error al crear torneo: ${data.message}`);
        }
    } catch (error) {
        console.error('Error al crear torneo:', error);
        alert('Ocurrió un error al crear el torneo. Inténtalo de nuevo más tarde.');
    }
}

async function mostrarTorneos() {
    const torneoList = document.getElementById('torneosList');
    torneosList.innerHTML = '<p style="color:#edcd3d;">Cargando Torneos...</p>';

    try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/torneos/obtenerTorneos', {
            headers: {
            'Authorization': `Bearer ${token}`
        }
        });
        const data = await res.json();
        // CORRIGE ESTA CONDICIÓN:
        if (!data.success || !data.torneos || data.torneos.length === 0) {
            torneosList.innerHTML = '<p style="color:#edcd3d;">No hay torneos.</p>';
            return;
        }

        torneosList.innerHTML = '';
        for (const torneo of data.torneos) {
            let botones = '';
            if (torneo.confirmado === false) {
                botones = `
                    <button type="button" class="btn btn-success" onclick="confirmarTorneo(${torneo.id})">Confirmar</button>
                    <button type="button" class="btn btn-editar btn-sm" data-bs-toggle="modal" data-bs-target="#modalEditar" onclick="cargarEditarTorneo('${torneo.id}','${torneo.nombre}','${torneo.fecha_inicio}','${torneo.fecha_fin}',)">Editar</button>
                    <button type="button" class="btn btn-editar btn-sm" data-bs-toggle="modal" data-bs-target="#modalEliminar" onclick="cargarEliminarTorneo('${torneo.id}','${torneo.nombre}')">Eliminar</button>
                `;
            } else {
                botones = `
                    <button type="button" class="btn btn-editar btn-sm" data-bs-toggle="modal" data-bs-target="#modalEliminar" onclick="cargarEliminarTorneo('${torneo.id}')">Eliminar</button>
                    <button type="button" class="btn btn-warning" onclick="finalizarTorneo(${torneo.id})">Finalizar</button>
                    <button type="button" class="btn btn-primary" onclick="ingresarTorneo(${torneo.id})">Ingresar</button>
                `;
            }
            const card = document.createElement('div');
            card.className="m-3";
            card.innerHTML += `
                <div class="card" style="width: 18rem;">
                    <img src="/img/Cómo-hacer-una-cancha-de-fútbol.jpg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <form id="fichajeForm">
                            <input type="hidden" id="id_torneo" value="${torneo.id}">
                            <h5 class="card-title">${torneo.nombre}</h5>
                            <p class="card-text">Fecha de Inicio: ${formatearFecha(torneo.fecha_inicio)}</p>
                            <p class="card-text">Fecha de Finalizacion: ${formatearFecha(torneo.fecha_fin)}</p>
                            ${botones}
                        </form>
                    </div>
                </div>`;
            torneosList.appendChild(card);
        }
    } catch (error) {
        console.error('Error al cargar los torneos:', error);
        torneosList.innerHTML = '<p style="color:#edcd3d;">Error al cargar los torneos</p>';
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

async function confirmarTorneo(idTorneo) {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/torneos/confirmarTorneo/${idTorneo}`, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    });
    const data = await res.json();
    if (data.success) {
        alert('Torneo confirmado');
        location.reload();
        cargarTorneos();
    } else {
        alert('Error: ' + data.message);
    }
}

async function finalizarTorneo(idTorneo) {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/torneos/finalizarTorneo/${idTorneo}`, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    });
    const data = await res.json();
    if (data.success) {
        alert('Torneo finalizado');
        // Recarga la lista de torneos o actualiza la UI
        cargarTorneos();
    } else {
        alert('Error: ' + data.message);
    }
}

async function cargarEditarTorneo(id, nombre, fechaInicio, fechaFin) {
    document.getElementById('modId').value = id;
    document.getElementById('modNombre').value = nombre;
    document.getElementById('modFechaInicio').value = fechaInicio.split('T')[0];
    document.getElementById('modFechaFin').value = fechaFin.split('T')[0];
}
async function modificarTorneo() {
    const id = document.getElementById('modId').value;
    const nombre = document.getElementById('modNombre').value;
    const fechaInicio = document.getElementById('modFechaInicio').value;
    const fechaFin = document.getElementById('modFechaFin').value; 
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/torneos/actualizarTorneo/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, fecha_inicio: fechaInicio, fecha_fin: fechaFin })
    });
    const data = await res.json();
    if (data.success) {
        alert('Torneo actualizado exitosamente');
        location.reload();
    } else {
        alert('Error al actualizar torneo: ' + data.message);
    }
}
async function cargarEliminarTorneo(id, nombre) {
    document.getElementById('delId').value = id;
    document.getElementById('delName').textContent = nombre;
}

async function eliminarTorneo() {
    const id = document.getElementById('delId').value;
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/torneos/eliminarTorneo/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    const data = await res.json();
    if (data.success) {
        alert('Torneo eliminado exitosamente');
        location.reload();
    } else {
        alert('Error al eliminar torneo: ' + data.message);
    }
}

async function ingresarTorneo(idTorneo) {
    localStorage.setItem('idTorneo', idTorneo);
    window.location.href = '/Views/Admin/torneoDetalle(admin).html';
}

async function ingresarEquipo() {
    console.log('Ingresando equipo al torneo');
    const idTorneo = localStorage.getItem('idTorneo');
    console.log('ID del torneo:', idTorneo);
    try{
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/equiposTorneo/cantidadEquiposTorneo/${idTorneo}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        });
        if (res.status === 401 || res.status === 403) {
            window.location.href = 'login.html';
            return;
        }
        const data = await res.json();
        console.log('Cantidad de equipos en el torneo:', data.cantidad);
        if (!data.success || data.cantidad >= 8) {
            const msgDiv = document.getElementById('message');
            msgDiv.style.display = 'block';
            msgDiv.className = "alert alert-warning d-flex align-items-center text-center";
            msgDiv.innerText = 'No se pueden ingresar más de 8 equipos al torneo';
            return;
        } else {
            const nombre = document.getElementById('nombre').value;
            const msgDiv = document.getElementById('message');
            msgDiv.style.display = 'none';
            msgDiv.className = "";

            try{
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/equiposTorneo/ingresarEquipoTorneo/${idTorneo}`, {
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
        }catch (error) {
            console.error('Error al ingresar equipo:', error);
            msgDiv.style.display = 'block';
            msgDiv.className = "alert alert-danger d-flex align-items-center text-center";
            msgDiv.innerText = 'Error al ingresar equipo';
            return
            }
        }
    }catch(error) {
        console.error('Error al verificar cantidad de equipos:', error);
        const msgDiv = document.getElementById('message');
        msgDiv.style.display = 'block';
        msgDiv.className = "alert alert-danger d-flex align-items-center text-center";
        msgDiv.innerText = 'Error al verificar cantidad de equipos';
        return;
    }
    
}

async function cargarEquipos() {
    const idTorneo = localStorage.getItem('idTorneo');
    console.log('Cargando equipos para el torneo:', idTorneo);
    const equiposList = document.getElementById('equiposList');
    equiposList.innerHTML = '<p style="color:#edcd3d;">Cargando Equipos...</p>';

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/equiposTorneo/obtenerEquiposTorneo/${idTorneo}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await res.json();
        if (!data.success || !data.equipos || data.equipos.length === 0) {
            equiposList.innerHTML = '<p style="color:#edcd3d;">No hay equipos en este torneo.</p>';
            return;
        }

        equiposList.innerHTML = '';
        for (const equipo of data.equipos) {
            const card = document.createElement('div');
            card.className="m-3";
            card.innerHTML += `
                <div class="card" style="width: 18rem;">
                    <img src="/img/Cómo-hacer-una-cancha-de-fútbol.jpg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${equipo.Equipo.nombre}</h5>
                        <button type="button" class="btn btn-jugadores btn-sm" onclick="jugadores('${equipo.Equipo.id}')">Jugadores</button>
                        <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#eliminarModal" onclick="prepararEliminarEquipo('${equipo.id}', '${equipo.Equipo.nombre}')">Eliminar</button>
                    </div>
                </div>`;
            equiposList.appendChild(card);
        }
    }
    catch (error) {
        console.error('Error al cargar los equipos:', error);
        equiposList.innerHTML = '<p style="color:#edcd3d;">Error al cargar los equipos</p>';
    }
}

async function prepararEliminarEquipo(idEquipo, nombreEquipo) {
    document.getElementById('delId').value = idEquipo;
    document.getElementById('delName').textContent = nombreEquipo;
}
async function eliminarEquipo() {
    const idEquipo = document.getElementById('delId').value;
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/equiposTorneo/eliminarEquipoTorneo/${idEquipo}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    const data = await res.json();
    if (data.success) {
        alert('Equipo eliminado exitosamente');
        location.reload();
    } else {
        alert('Error al eliminar equipo: ' + data.message);
    }
}

async function jugadores(idEquipo) {
    localStorage.setItem('idEquipo', idEquipo);
    window.location.href = '/Views/Admin/plantel(admin).html';
}

async function configurarPartido() {
    const idTorneo = localStorage.getItem('idTorneo');
    const equipo1 = document.getElementById('equipo1').value;
    const equipo2 = document.getElementById('equipo2').value;
    const fecha = document.getElementById('fecha').value;
    const nroFecha = document.getElementById('idFecha').value;
    if (!equipo1 || !equipo2 || !fecha) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    try{
        const token = localStorage.getItem('token');
        const response = await fetch('/api/partidosTorneo/crearPartido', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_torneo: idTorneo, fecha, equipo_local: equipo1, equipo_visitante: equipo2, nroFecha})
        });

        const data = await response.json();
        if (data.success) {
            alert('Partido creado exitosamente');
            location.reload();
        } else {
            alert(`Error al crear partido: ${data.message}`);
        }
    }catch (error) {
        console.error('Error al crear partido:', error);
        alert('Ocurrió un error al crear el partido. Inténtalo de nuevo más tarde.');
    }
}

async function cargarPartidos() {
    const id_torneo = localStorage.getItem('idTorneo');
    if (!idTorneo) {
        alert('No se ha seleccionado un torneo. Por favor, selecciona un torneo primero.');
        return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/Views/Login/login.html';
        return;
    }

    try {
        const res = await fetch(`/api/partidosTorneo/obtenerPartidos/${id_torneo}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await res.json();
        if (!data.success || !Array.isArray(data.partidos)) {
            console.error('Error en la respuesta del servidor:', data);
            alert('No se pudieron cargar los partidos.');
            return;
        }

        for (const partido of data.partidos) {
            const token = localStorage.getItem('token');
            const equipo_1 = await fetch(`/api/equipos/obtenerEquipo/${partido.Equipo_1.id_equipo}`, {
                method: 'get',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const name_1 = await equipo_1.json();
            const equipo_2 = await fetch(`/api/equipos/obtenerEquipo/${partido.Equipo_2.id_equipo}`,{
                method: 'get',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const name_2 = await equipo_2.json();

            document.getElementById('id_partido_'+partido.nroFecha).innerHTML = partido.id;
            if(name_1.equipo) document.getElementById('e' + partido.nroFecha + '1').innerHTML = name_1.equipo.nombre;
            if(name_2.equipo) document.getElementById('e' + partido.nroFecha + '2').innerHTML = name_2.equipo.nombre;
            if(partido.fecha) document.getElementById('fecha' + partido.nroFecha).innerHTML = formatearFecha(partido.fecha);
            document.getElementById('g' + partido.nroFecha + '1').innerHTML = partido.goles_1;
            document.getElementById('g' + partido.nroFecha + '2').innerHTML = partido.goles_2;
        }
    }catch (error) {
        console.error('Error al cargar los partidos:', error);
    }     
}

async function finalizarPartido(){
    const resultado1 = document.getElementById('resultado1').value;
    const resultado2 = document.getElementById('resultado2').value;
    const nroFecha = document.getElementById('nroFecha').value;
    const id_torneo = localStorage.getItem('idTorneo');
    console.log(resultado1, resultado2, nroFecha, id_torneo);

    const token = localStorage.getItem('token');

    const res = await fetch (`/api/partidosTorneo/actualizarPartido/${id_torneo}`,{
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({goles_1: resultado1, goles_2: resultado2, nroFecha: nroFecha})
    });
    const data = await res.json();
    console.log(data);
    if (data.success) {
        if(data.partido.nroFecha != 7){
            if(data.partido.nroFecha % 2 === 0){
                const nroFecha = posicion(data.partido.nroFecha);
                console.log('fecha transfromada: '+nroFecha)
                if(data.partido.goles_1 > data.partido.goles_2){
                    const token = localStorage.getItem('token');
                    const response = await fetch('/api/partidosTorneo/clasificado', {
                        method: 'PUT',  
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id_torneo: data.partido.id_torneo, id_equipo_2:  data.partido.id_equipo_1 , nroFecha: nroFecha})
                    });
                } else{
                    const token = localStorage.getItem('token');
                    const response = await fetch('/api/partidosTorneo/clasificado', {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id_torneo: data.partido.id_torneo, id_equipo_2:  data.partido.id_equipo_2, nroFecha: nroFecha})
                    });
                }
            }else{
                const nroFecha = posicion(data.partido.nroFecha);
                console.log('fecha transfromada: '+nroFecha)
                if(data.partido.goles_1 > data.partido.goles_2){
                    const token = localStorage.getItem('token');
                    const response = await fetch('/api/partidosTorneo/clasificado', {
                        method: 'PUT',  
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id_torneo: data.partido.id_torneo, id_equipo_1:  data.partido.id_equipo_1 , nroFecha: nroFecha})
                    });
                } else{
                    const token = localStorage.getItem('token');
                    const response = await fetch('/api/partidosTorneo/clasificado', {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id_torneo: data.partido.id_torneo, id_equipo_1:  data.partido.id_equipo_2, nroFecha: nroFecha})
                    });
                }
            }
        } else{
            if(data.partido.goles_1 > data.partido.goles_2){
                try{
                    const token = localStorage.getItem('token');
                    const res = await fetch(`/api/equiposTorneo/campeon/${data.partido.id_equipo_1}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    });
                    const fin = await fetch(`/api/torneos/finalizarTorneo/${data.partido.id_torneo}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    }); 
                }catch{
                   console.error('Error al cargar al campeon:', error); 
                }
            }else{
                try{
                    const token = localStorage.getItem('token');
                    const res = await fetch(`/api/equiposTorneo/campeon/${data.partido.id_equipo_2}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    });
                    const fin = await fetch(`/api/torneos/finalizarTorneo/${data.partido.id_torneo}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    }); 
                }catch{
                   console.error('Error al cargar al campeon:', error); 
                }
            }
        }   
        location.reload();
    } else {
        console.log('no se pudo actualizar');
    }
}



function posicion(nroFecha) {
    if(nroFecha == 7){
            nroPosicion = nroFecha;
        }else if(nroFecha == 6){
            nroPosicion = nroFecha + 1;
        }else if(nroFecha == 5 ||nroFecha == 4){
            nroPosicion = nroFecha + 2;
        }else if(nroFecha == 3 || nroFecha == 2){
            nroPosicion = nroFecha + 3;
        }else{
            nroPosicion = nroFecha + 4;
    }
    return nroPosicion;
}

async function cargarClasificatoria(){
    const fecha2 = document.getElementById('fechaNueva').value;
    const nroFecha = document.getElementById('nroFecha2').value;
    const id_torneo = localStorage.getItem('idTorneo');

    const token = localStorage.getItem('token');
    console.log('Front:' + id_torneo, fecha2, nroFecha);
    const res = await fetch (`/api/partidosTorneo/confFecha/${id_torneo}`,{
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({fecha: fecha2, nroFecha: nroFecha})
    });
    const data = await res.json();
}





