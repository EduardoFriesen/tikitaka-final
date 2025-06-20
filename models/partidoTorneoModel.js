const { Model } = require('sequelize');
const { sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
    class partidoTorneo extends Model {
        static associate(models) {
            partidoTorneo.belongsTo(models.Torneo, { as: 'Torneo', foreignKey: 'id_torneo' });
            partidoTorneo.belongsTo(models.EquipoTorneo, { as: 'Equipo_1', foreignKey: 'id_equipo_1' });
            partidoTorneo.belongsTo(models.EquipoTorneo, { as: 'Equipo_2', foreignKey: 'id_equipo_2' });
        }
    }
    partidoTorneo.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_torneo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_equipo_1: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_equipo_2: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        fecha: {
                type: DataTypes.DATE,
                allowNull: true
            },
        goles_1: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        goles_2: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        nroFecha: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'partidoTorneo',
        tableName: 'partidos_torneo',
        timestamps: false
    });
    return partidoTorneo;
}