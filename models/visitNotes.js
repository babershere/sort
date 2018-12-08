
module.exports = function (sequelize, DataTypes) {
    var visitNotes = sequelize.define("visitNotes", {
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

    visitNotes.associate = function (models) {
        models.visitNotes.belongsTo(models.Visits, {
            foreignKey: {
                allowNull: false
            }
        })
        models.visitNotes.belongsTo(models.Physicians, {
            foreignKey: {
                allowNull: false
            }
        });
        models.visitNotes.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return visitNotes;
};