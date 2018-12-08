
module.exports = function (sequelize, DataTypes) {
    var Visits = sequelize.define("Visits", {
        dateTime: {
            type: DataTypes.DATE,
            allowNull: false,
            // field: 'date_time'
        },
        Rep: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Physician: {
            type: DataTypes.STRING,
            allowNull: true
        },
        PhysicianId: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    Visits.associate = function (models) {
        models.Visits.hasMany(models.visitNotes, {
            onDelete: "cascade"
        })
    }

    return Visits;
};