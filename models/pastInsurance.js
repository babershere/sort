
module.exports = function (sequelize, DataTypes) {
    var pastInsurance = sequelize.define("pastInsurance", {
        plan: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        BIN: {
            type: DataTypes.STRING,
            allowNull: true
        },
        PCN: {
            type: DataTypes.STRING,
            allowNull: true
        },
        insID: {
            type: DataTypes.STRING,
            allowNull: true
        },
        group: {
            type: DataTypes.STRING,
            allowNull: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    pastInsurance.associate = function (models) {
        models.pastInsurance.belongsTo(models.Patients, {
            foreignKey: {
                allowNull: false
            }
        })
    }
  
    return pastInsurance;
};