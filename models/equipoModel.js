const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Equipo extends Model {
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
            },
        },{
            sequelize,
            modelName: 'Equipo',
            tableName: 'equipos',
            timestamps: false
        });
    return Equipo;
       
}