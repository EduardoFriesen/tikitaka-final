const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Equipo extends Model {
        static associate(models) {
            Equipo.hasMany(models.EquipoTorneo, {
                as: 'EquiposTorneos',
                foreignKey: 'id_equipo'
            });
        }
    }

    Equipo.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Equipo',
        tableName: 'equipos',
        timestamps: false
    });

    return Equipo;
};