async function cargarHistorial() {
  const torneosList = document.getElementById('torneos');
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/torneos/Historial`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = 'login.html';
      return;
    }

    const data = await res.json();

    console.log('Torneos recibidos:', data.torneos); // Para debug

    if (!data.success || !data.torneos || data.torneos.length === 0) {
      torneosList.innerHTML = '<tr><td colspan="5" style="color:#edcd3d;">No hay Torneos.</td></tr>';
      return;
    }

    torneosList.innerHTML = ''; // limpio contenido

    for (const torneo of data.torneos) {
      const card = document.createElement('tr');
      card.innerHTML = `
        <td>${torneo.nombre}</td>
        <td>${formatearFecha(torneo.fecha_inicio)}</td>
        <td>${formatearFecha(torneo.fecha_fin)}</td>
        <td>${torneo.campeon}</td>
        <td>
          <button type="button" class="btn btn-primary" onclick="ingresarTorneo(${torneo.id})">Detalle</button>
        </td>
      `;
      torneosList.appendChild(card);
    }

  } catch (error) {
    console.error('Error al cargar los torneos:', error);
    torneosList.innerHTML = '<tr><td colspan="5" style="color:#edcd3d;">Error al cargar el Historial</td></tr>';
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
