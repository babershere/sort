
module.exports = function(sequelize, DataTypes) {
    var patientAttachments = sequelize.define("patientAttachments", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
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
    patientAttachments.associate = function(models) {
        models.patientAttachments.belongsTo(models.Patients, {
            foreignKey: {
                allowNull: false
            }
        })
        models.patientAttachments.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };
    return patientAttachments; 
  };