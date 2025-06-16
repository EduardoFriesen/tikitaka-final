async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const msgDiv = document.getElementById('message');
    msgDiv.style.display = 'none'; // Oculta el mensaje antes de enviar
    msgDiv.className = "";

    const res = await fetch('/api/usuarios/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) {
        localStorage.setItem('token', data.token);
        if( data.admin) {
            window.location.href = '/Views/Admin/Dashboard(admin).html';
        }else{
            window.location.href = "/Views/User/partidosUsuario.html";
        }
        
    } else {
        msgDiv.style.display = 'block';
        msgDiv.className = "alert alert-warning d-flex align-items-center text-center"; // Cambia la clase para aplicar estilos de error
        msgDiv.innerText = data.message;
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/Views/Login/login.html';
}