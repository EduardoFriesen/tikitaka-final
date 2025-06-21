const equipoServices = require('../services/equipoServices');

const equipoController = {

    // Crear equipo
    crearEquipo: async (req, res) => {
        try {
            const { nombre } = req.body;
            const equipo = await equipoServices.crearEquipo({ nombre });
            res.send({ success: true, equipo });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },
    
    // Obtener todos los equipos
    obtenerEquipos: async (req, res) => {
        try {
        const equipos = await equipoServices.obtenerEquipos();
        res.send({ success: true, equipos });
        } catch (error) {
        res.send({ success: false, message: error.message });
        }
    },
    
    // Obtener equipo por ID
    obtenerEquipoPorId: async (req, res) => {
        try {
        const id = req.params.id;
        const equipo = await equipoServices.obtenerEquipoPorId(id);
        res.send({ success: true, equipo });
        } catch (error) {
        res.send({ success: false, message: error.message });
        }
    },
    
    // Actualizar equipo
    actualizarEquipo: async (req, res) => {
        try {
        const id = req.params.id;
        const { nombre } = req.body;
        const equipo = await equipoServices.actualizarEquipo(id, { nombre });
        res.send({ success: true, equipo });
        } catch (error) {
        res.send({ success: false, message: error.message });
        }
    },
    
    // Eliminar equipo
    eliminarEquipo: async (req, res) => {
        try {
        const id = req.params.id;
        const result = await equipoServices.eliminarEquipo(id);
        res.send({ success: true, message: result.message });
        } catch (error) {
        res.send({ success: false, message: error.message });
        }
    }
};

module.exports = equipoController;