const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class EquipoTorneo extends Model {
        static associate(models) {
            EquipoTorneo.belongsTo(models.Equipo, { as: 'Equipo', foreignKey: 'id_equipo' });
            EquipoTorneo.belongsTo(models.Torneo, { as: 'Torneo', foreignKey: 'id_torneo' });
            // Si necesitas más asociaciones, agrégalas aquí
        }
    }
    EquipoTorneo.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_equipo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Equipos',
                key: 'id'
            }
        },
        id_torneo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Torneos',
                key: 'id'
            }
        },
    },{
        sequelize,
        modelName: 'EquipoTorneo',
        tableName: 'equipos_torneos',
        timestamps: false
    });
    return EquipoTorneo;
}