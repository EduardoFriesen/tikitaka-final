const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Turno extends Model {
        static associate(models) {
            Turno.belongsTo(models.Partido, { foreignKey: 'id_partido' });
            Turno.belongsTo(models.Usuario, { foreignKey: 'id_jugador' });
        }
    }

    Turno.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_partido: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'partidos',
                key: 'id'
            }
        },
        id_jugador: {
            type : DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuarios',
                key: 'id'
            }
        },
        cancha: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
    }, {
        sequelize,
        modelName: 'Turno',
        tableName: 'turnos',
        timestamps: false
    });

    return Turno;
}