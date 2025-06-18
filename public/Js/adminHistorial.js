function cargarHistorial() {
  const tbody = document.getElementById("tablaHistorial");

  const resultados = [
    {
      equipo1: "Los Pibes",
      goles1: 3,
      equipo2: "Titanes",
      goles2: 2,
      resultado: "Ganó Los Pibes",
      fecha: "2025-06-10",
      torneo: "Torneo Invierno"
    }
  ];

  resultados.forEach(res => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${res.equipo1}</td>
      <td>${res.goles1}</td>
      <td>${res.equipo2}</td>
      <td>${res.goles2}</td>
      <td>${res.resultado}</td>
      <td>${res.fecha}</td>
      <td>${res.torneo}</td>
      <td><button class="btn btn-danger btn-sm">Eliminar</button></td>
    `;
    tbody.appendChild(fila);
  });
}

function crearResultado() {
  alert("Resultado registrado correctamente (simulado)");
  document.getElementById("formCrearResultado").reset();
  const modal = bootstrap.Modal.getInstance(document.getElementById("modalCrear"));
  modal.hide();
}
