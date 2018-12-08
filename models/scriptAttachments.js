
module.exports = function(sequelize, DataTypes) {
    var scriptAttachments = sequelize.define("scriptAttachments", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        attachedBy: {
            type: DataTypes.STRING,
            allowNull: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        link: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }); 

    scriptAttachments.associate = function (models) {
        models.scriptAttachments.belongsTo(models.Scripts, {
            foreignKey: {
                allowNull: false
            }
        })
        models.scriptAttachments.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    }
    return scriptAttachments; 
  };