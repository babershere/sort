

module.exports = function(sequelize, DataTypes) {
    var Physicians = sequelize.define("Physicians", {
        firstName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        group: {
            type: DataTypes.STRING,
            allowNull: true
        },
        rep: {
            type: DataTypes.STRING,
            allowNull: true
        },  
        specialization: {
            type: DataTypes.STRING,
            allowNull: true
        },
        DEA: {
            type: DataTypes.STRING,
            allowNull: true
        },
        NPI: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fax: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        contact: {
            type: DataTypes.STRING,
            allowNull: true
        },
        addressStreet: {
            type: DataTypes.STRING,
            allowNull: true
        },
        addressCity: {
            type: DataTypes.STRING,
            allowNull: true
        },
        addressState: {
            type: DataTypes.STRING,
            allowNull: true
        },
        addressZipCode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        physicianWarning: {
            type: DataTypes.STRING,
            allowNull: true
        }  
    }); 

    Physicians.associate = function(models) {
        models.Physicians.hasMany(models.Scripts, {
            onDelete: "cascade"
        });
        models.Physicians.hasMany(models.User, {
            onDelete: "cascade"
        });
    };

    return Physicians; 
  };