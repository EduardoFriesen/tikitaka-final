const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Torneo extends Model {
        static associate(models){
            Torneo.hasMany(models.EquipoTorneo, { as: 'EquiposTorneos', foreignKey: 'id_torneo' });
        }
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
            confirmado: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            finalizado: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        },{
            sequelize,
            modelName: 'Torneo',
            tableName: 'torneos',
            timestamps: false
        });
    return Torneo;  
}