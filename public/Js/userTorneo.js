async function cargarPartidos() {
    const token = localStorage.getItem('token');
    const torneo = getElementById('torneo');
    const res = await fetch(`/api/partidosTorneo/obtenerIdTorneo/${req.user.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    const data = await res.json();
    if (!data.success || !Array.isArray(data.partidos)) {
            console.error('Error en la respuesta del servidor:', data);
            alert('No estas en ningun Torneo.');
            return;
        }
    for(const torneo of data.torneos){ 
        torneo.innerHTML=`torne`;
         try {
        const res = await fetch(`/api/partidosTorneo/obtenerPartidos/${torneo.id_torneo}`, {
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
    if (!token) {
        window.location.href = '/Views/Login/login.html';
        return;
    }
}

async function ingresarTorneo(idTorneo) {
    localStorage.setItem('idTorneo', idTorneo);
    window.location.href = '/Views/User/torneoDetalle(user).html';
}

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

