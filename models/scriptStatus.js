
module.exports = function (sequelize, DataTypes) {
    var scriptStatuses = sequelize.define("scriptStatuses", {
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fromStatus: {
            type: DataTypes.STRING,
            allowNull: true
        },
        toStatus: {
            type: DataTypes.STRING,
            allowNull: true
        },
        userImage: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });


    scriptStatuses.associate = function (models) {
        models.scriptStatuses.belongsTo(models.Scripts, {
            foreignKey: {
                allowNull: false
            }
        }),
        models.scriptStatuses.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        })
    };

    return scriptStatuses;
};