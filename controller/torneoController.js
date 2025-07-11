const torneoServices = require('../services/torneoServices');

const torneoController = {
    // Crear torneo
    crearTorneo: async (req, res) => {
        try {
            const { nombre, fecha_inicio, fecha_fin } = req.body;
            const torneo = await torneoServices.crearTorneo({ nombre, fecha_inicio, fecha_fin });
            res.send({ success: true, torneo });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },

    // Obtener todos los torneos
    obtenerTorneos: async (req, res) => {
        try {
            const torneos = await torneoServices.obtenerTorneos();
            res.send({ success: true, torneos });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },

    cargarFinalizados: async (req, res) => {
        try {
            const torneos = await torneoServices.cargarFinalizados();
            res.send({ success: true, torneos });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },

    // Obtener torneo por ID
    obtenerTorneoPorId: async (req, res) => {
        try {
            const id = req.params.id;
            const torneo = await torneoServices.obtenerTorneoPorId(id);
            res.send({ success: true, torneo });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },

    // Actualizar torneo
    actualizarTorneo: async (req, res) => {
        try {
            const id = req.params.id;
            const { nombre, fecha_inicio, fecha_fin } = req.body;
            const torneo = await torneoServices.actualizarTorneo(id, { nombre, fecha_inicio, fecha_fin });
            res.send({ success: true, torneo });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },

    // Eliminar torneo
    eliminarTorneo: async (req, res) => {
        try {
            const id = req.params.id;
            const result = await torneoServices.eliminarTorneo(id);
            res.send({ success: true, message: result.message });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },

    // Confirmar torneo
    confirmarTorneo: async (req, res) => {
        try {
            const id = req.params.id;
            const torneo = await torneoServices.confirmarTorneo(id);
            res.send({ success: true, torneo });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },
    // Finalizar torneo
    finalizarTorneo: async (req, res) => {
        try {
            const id = req.params.id;
            console.log(id);
            const torneo = await torneoServices.finalizarTorneo(id);
            res.send({ success: true, torneo });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },
    Historial: async (req, res)=>{
        try{
            console.log('id usuario: ');
            const id_usuario = req.user.id;
            const torneos = await torneoServices.Historial(id_usuario);
            console.log(torneos);
            res.send({ success: true, torneos });  
        }catch{
            res.send({ success: false, message: error.message });
        }
        
    },
};
module.exports = torneoController;