const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Jugador extends Model {
        static associate(models) {
            Jugador.belongsTo(models.Usuario, { as: 'Usuario', foreignKey: 'id_usuario' });
            Jugador.belongsTo(models.Equipo, { as: 'Equipo', foreignKey: 'id_equipo' });
        }
    }
        Jugador.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            id_usuario: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Usuarios',
                    key: 'id'
                }
            },
            id_equipo: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Equipos',
                    key: 'id'
                }
            },
            camiseta: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        },{
            sequelize,
            modelName: 'Jugador',
            tableName: 'jugadores',
            timestamps: false
        });
    return Jugador;
       
}