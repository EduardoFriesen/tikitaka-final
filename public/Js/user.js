async function cargarUser(){
    
    const token = localStorage.getItem('token');
    const res = await fetch('/api/usuarios/mostrarUser', {
        headers: { 'Authorization': 'Bearer ' + token }
    });
    if (res.status === 401 || res.status === 403) {
        window.location.href = 'login.html';
        return;
    }
    const data = await res.json();
    console.log(data.usuario);
    if (!data.success) {
        console.error('Error al obtener los datos del usuario:', data.message);
        return;
    }else{
        document.getElementById('email').value = data.usuario.email;
        document.getElementById('username').value = data.usuario.username;
    }
}

async function modUser(){
    const username = document.getElementById('username').value;
    const password = document.getElementById('contrasena').value;
    const newPassword = document.getElementById('newContrasena').value;
    msgDiv = document.getElementById('message');

    const token = localStorage.getItem('token');
    const res = await fetch('/api/usuarios/modUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ username, password, newPassword })
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
            logout();
        }, 3000); 
    } else {
        msgDiv.style.display = 'block';
        msgDiv.className = "alert alert-warning d-flex align-items-center text-center"; // Cambia la clase para aplicar estilos de error
        msgDiv.innerText = data.message;
    }
}