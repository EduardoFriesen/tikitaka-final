async function cargarUsers(){
    const usuariosList = document.getElementById('usuarios');

    try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/usuarios/cargarUsers', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();
        if (!data.success || !data.usuarios || data.usuarios.length === 0) {
            usuariosList.innerHTML = '<p style="color:#edcd3d;">No hay Usuarios.</p>';
            return;
        }
        if (res.status === 401 || res.status === 403) {
            window.location.href = 'login.html';
            return;
        }
        usuariosList.innerHTML = '';
        for (const usuario of data.usuarios) {
            const card = document.createElement('tr');
            card.innerHTML += `
            <td>${usuario.username}</td>
            <td>${usuario.name}</td>
            <td>${usuario.lastname}</td>
            <td>${formatearFecha(usuario.birthdate)}</td>
            <td>${usuario.email}</td>
            <td>${usuario.admin}</td>
            <td>
             <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#modalEditar"
                onclick="cargarDatosEditar('${usuario.username}', '${usuario.name}', '${usuario.lastname}', '${usuario.birthdate}', '${usuario.email}', '${usuario.admin.checked}')">Editar</button>
            <button class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#modalPrueba"
                onclick="prepararEliminarUser(${usuario.id}, '${usuario.username}')">Eliminar</button>
            </td>
                `;
            usuariosList.appendChild(card);
        }
    } catch (error) {
        console.error('Error al cargar los partidos:', error);
        usuariosList.innerHTML = '<p style="color:#edcd3d;">Error al cargar los partidos</p>';
    }
}

async function cargarUser(){
    
    const token = localStorage.getItem('token');
    const res = await fetch('/api/usuarios/mostrarUser', {
        headers: { 'Authorization': 'Bearer ' + token }
    });
    if (res.status === 401 || res.status === 403) {
        window.location.href = '/Views/Login/login.html';
        return;
    }
    const data = await res.json();
    if (!data.success) {
        console.error('Error al obtener los datos del usuario:', data.message);
        return;
    }else{
        document.getElementById('email').value = data.usuario.email;
        document.getElementById('username').value = data.usuario.username;
        document.getElementById('adminMod').checked = data.usuario.admin;
    }
}

async function modificarUser() {

    const username = document.getElementById('user').value;
    const name = document.getElementById('name').value;
    const lastname = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const birthdate = document.getElementById('birthdate').value;
    const admin = document.getElementById('adminMod').checked;
    const msgDiv = document.getElementById('message');
    
    msgDiv.style.display = 'none'; // Oculta el mensaje antes de enviar
    msgDiv.className = "";

    const token = localStorage.getItem('token');
    const res = await fetch('/api/usuarios/modificarUserAdmin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ username, name, lastname, email, birthdate, admin})
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
            msgDiv.style.display = 'block';
            msgDiv.className = "alert alert-warning d-flex align-items-center text-center";
            msgDiv.innerText = data.message;
            window.location.reload();
        }, 1000); 
    } else {
        msgDiv.style.display = 'block';
        msgDiv.className = "alert alert-warning d-flex align-items-center text-center"; // Cambia la clase para aplicar estilos de error
        msgDiv.innerText = data.message;
    }
}

async function eliminarUser(id){

    const msgDiv = document.getElementById('message');
    msgDiv.style.display = 'none'; // Oculta el mensaje antes de enviar
    msgDiv.className = "";

    const token = localStorage.getItem('token');
    const res = await fetch('/api/usuarios/eliminarUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ id })
    });
    const data = await res.json();
    if (data.success) {
        msgDiv.style.display = 'block';
        msgDiv.className = "alert alert-success d-flex align-items-center text-center"; // Cambia la clase para aplicar estilos de éxito
        msgDiv.innerText = data.message;
        setTimeout(() => {
            msgDiv.style.display = 'block';
            msgDiv.className = "alert alert-warning d-flex align-items-center text-center";
            msgDiv.innerText = data.message;
            window.location.reload();
        }, 1000); 
    } else {
        msgDiv.style.display = 'block';
        msgDiv.className = "alert alert-warning d-flex align-items-center text-center"; // Cambia la clase para aplicar estilos de error
        msgDiv.innerText = data.message;
    }
}

let idUsuarioAEliminar = null;

function prepararEliminarUser(id, username) {
  console.log("Preparando modal para:", id, username);
  idUsuarioAEliminar = id;
  document.getElementById('usuarioEliminar').innerText = username;
}

function confirmarEliminarUser() {
    if (idUsuarioAEliminar !== null) {
        console.log("Confirmando eliminación de usuario con ID:", idUsuarioAEliminar);
        eliminarUser(idUsuarioAEliminar);
        idUsuarioAEliminar = null;
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalPrueba'));
        if (modal) modal.hide();
    }
}

async function crearUserAdmin(){
    const username = document.getElementById('nuevoUsername').value;
    const name = document.getElementById('nuevoName').value;
    const lastname = document.getElementById('nuevoLastname').value;
    const birthdate = document.getElementById('nuevoBirthdate').value;
    const email = document.getElementById('nuevoEmail').value;
    const password = document.getElementById('nuevoPassword').value;
    const repPassword = document.getElementById('nuevoRepPassword').value;
    const admin = document.getElementById('nuevoAdmin').checked;

    const res = await fetch('/api/usuarios/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, name, lastname, birthdate, email, password, repPassword, admin })
    });
    if (res.status === 401 || res.status === 403) {
        window.location.href = 'login.html';
        return;
    }
    const data = await res.json();
    const msgDiv = document.getElementById('message');
    if (data.success) {
        msgDiv.style.display = 'block';
        msgDiv.className = "alert alert-success d-flex align-items-center text-center";
        msgDiv.innerText = data.message;
        setTimeout(() => { window.location.reload(); }, 1000);
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

async function cargarDatos(){
    const token = localStorage.getItem('token');
    const resUsuarios = await fetch('/api/usuarios/cantUsuarios', {
        headers: { 'Authorization': 'Bearer ' + token }
    });
    const dataUsuarios = await resUsuarios.json();
    if (dataUsuarios.success) {
        document.getElementById('cantJugadores').innerText = dataUsuarios.cantidad;
    } else {
        document.getElementById('cantJugadores').innerText = 'Error';
    }

    const resPartidos = await fetch('/api/partidos/cantPartidos', {
        headers: { 'Authorization': 'Bearer ' + token }
    });
    const dataPartidos = await resPartidos.json();
    if (dataPartidos.success) {
        document.getElementById('cantPartidos').innerText = dataPartidos.cantidad;
    } else {
        document.getElementById('cantPartidos').innerText = 'Error';
    }
}
window.prepararEliminarUser = prepararEliminarUser;
window.confirmarEliminarUser = confirmarEliminarUser;
