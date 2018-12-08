module.exports = function(sequelize, DataTypes) {
    var Products = sequelize.define("Products", {
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        NDC: {
            type: DataTypes.STRING,
            allowNull: true
        },
        quantity: {
            type: DataTypes.STRING,
            allowNull: true
        },
        packageSize: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cost: {
            type: DataTypes.STRING,
            allowNull: true
        },
        val: {
            type: DataTypes.STRING,
            allowNull: true
        },
        schedule: {
            type: DataTypes.STRING,
            allowNull: true
        },
        dosage: {
            type: DataTypes.STRING,
            allowNull: true
        },
        form: {
            type: DataTypes.STRING,
            allowNull: true
        },
        unitMeasure: {
            type: DataTypes.STRING,
            allowNull: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        refrigerated: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
    })

    Products.associate = function(models) {
        models.Products.hasMany(models.Scripts, {
            onDelete: "cascade"
        });
    };


return Products; 
};