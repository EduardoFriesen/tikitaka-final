const express = require('express');
const app = express();
const path = require('path');
const sequelize = require('./config/db');
require('./models');
const usuarioRoutes = require('./routes/usuarioRoutes');
const partidoRoutes = require('./routes/partidoRoutes');
const turnoRoutes = require('./routes/turnoRoutes');
const jugadorRoutes = require('./routes/jugadorRoutes');
const equipoRoutes = require('./routes/equipoRoutes');
const torneoRoutes = require('./routes/torneoRoutes');
const equipoTorneoRoutes = require('./routes/equipoTorneoRoutes');
const partidoTorneoRoutes = require('./routes/partidoTorneoRoutes');
const jugadorTorneoRoutes = require('./routes/jugadorTorneoRoutes');


// Middlewares
app.use(express.json());

// Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/partidos', partidoRoutes);
app.use('/api/turnos', turnoRoutes);
app.use('/api/jugadores', jugadorRoutes);
app.use('/api/equipos', equipoRoutes);
app.use('/api/torneos', torneoRoutes);
app.use('/api/partidosTorneo', partidoTorneoRoutes);
app.use('/api/equiposTorneo', equipoTorneoRoutes);

app.use(express.static('public'));

// Conexión a la base de datos y arranque del servidor
const PORT = process.env.PORT || 3000;
sequelize.sync() // <-- Cambia authenticate() por sync()
  .then(() => {
    console.log('Tablas sincronizadas y conexión exitosa');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('No se pudo sincronizar la base de datos:', err);
  });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Views', 'Inicio', 'Pantalla1.html'));
});