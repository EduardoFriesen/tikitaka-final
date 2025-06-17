const { Model } = require('sequelize');
const { sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
    class partidoTorneo extends Model {
        static associate(models) {
            partidoTorneo.belongsTo(models.EquipoTorneo, { as: 'Equipo_1', foreignKey: 'id_equipo_1' });
            partidoTorneo.belongsTo(models.EquipoTorneo, { as: 'Equipo_2', foreignKey: 'id_equipo_2' });
            partidoTorneo.belongsTo(models.Fecha, { as: 'Fecha', foreignKey: 'id_fecha' });
        }
    }
    partidoTorneo.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_equipo_1: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_equipo_2: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_fecha: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        goles_1: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        goles_2: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        sequelize,
        modelName: 'partidoTorneo',
        tableName: 'partidos_torneo',
        timestamps: false
    });
    return partidoTorneo;
}