const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Fecha extends Model {
    }
        Fecha.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            id_torneo: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Torneos',
                    key: 'id'
                }
            },
            fecha: {
                type: DataTypes.DATE,
                allowNull: false
            },
        },{
            sequelize,
            modelName: 'Equipo',
            tableName: 'equipos',
            timestamps: false
        });
    return Equipo;
       
}