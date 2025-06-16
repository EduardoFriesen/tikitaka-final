const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Partido extends Model {
        static associate(models) {
            Partido.belongsTo(models.Usuario, { as: 'Usuario', foreignKey: 'owner' });
            Partido.hasMany(models.Turno, { foreignKey: 'id_partido' });
        }
    }

    Partido.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        owner: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuarios',
                key: 'id'
            }
        },
        jugadores: {
            type : DataTypes.INTEGER,
            allowNull: false
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false
        },
        hora: {
            type: DataTypes.TIME,
            allowNull: false
        },
        cancha: {
            type: DataTypes.INTEGER, // Corregido aquí
            allowNull: true
        },
    }, {
        sequelize,
        modelName: 'Partido',
        tableName: 'partidos',
        timestamps: false
    });

    return Partido;
}