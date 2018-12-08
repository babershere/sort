
module.exports = function (sequelize, DataTypes) {
    var scriptNotes = sequelize.define("scriptNotes", {
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        note: {
            type: DataTypes.STRING,
            allowNull: true
        },
        userImage: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    scriptNotes.associate = function (models) {
        models.scriptNotes.belongsTo(models.Scripts, {
            foreignKey: {
                allowNull: false
            }
        })
        models.scriptNotes.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return scriptNotes;
};