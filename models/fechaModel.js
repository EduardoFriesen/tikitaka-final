const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Fecha extends Model {
        static associate(models) {
            Fecha.belongsTo(models.Torneo, { as: 'Torneo', foreignKey: 'id_torneo' });
            Fecha.hasMany(models.partidoTorneo, { as: 'Partidos', foreignKey: 'id_fecha' });
        }
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
            modelName: 'Fecha',
            tableName: 'fechas',
            timestamps: false
        });
    return Fecha;
       
}