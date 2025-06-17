const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Torneo extends Model {
    }
        Torneo.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nombre: {
                type: DataTypes.STRING,
                allowNull: false
            },
            fecha_inicio: {
                type: DataTypes.DATE,
                allowNull: false
            },
            fecha_fin: {
                type: DataTypes.DATE,
                allowNull: false
            },
        },{
            sequelize,
            modelName: 'Torneo',
            tableName: 'torneos',
            timestamps: false
        });
    return Torneo;  
}