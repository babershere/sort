
module.exports = function(sequelize, DataTypes) {
    var Patients = sequelize.define("Patients", {
        firstName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        dob: {
            type: DataTypes.STRING,
            allowNull: true
        },
        sex: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        patientWarning: {
            type: DataTypes.STRING,
            allowNull: true
        },
        conditions: {
            type: DataTypes.STRING,
            allowNull: true
        },
        allergies: {
            type: DataTypes.STRING,
            allowNull: true
        },
        primInsPlan: {
            type: DataTypes.STRING,
            allowNull: true
        },
        primInsBIN: {
            type: DataTypes.STRING,
            allowNull: true
        },
        primInsPCN: {
            type: DataTypes.STRING,
            allowNull: true
        },
        primInsID: {
            type: DataTypes.STRING,
            allowNull: true
        },
        primInsGroup: {
            type: DataTypes.STRING,
            allowNull: true
        },
        primInsType: {
            type: DataTypes.STRING,
            allowNull: true
        },
        secInsPlan: {
            type: DataTypes.STRING,
            allowNull: true
        },
        secInsBIN: {
            type: DataTypes.STRING,
            allowNull: true
        },
        secInsPCN: {
            type: DataTypes.STRING,
            allowNull: true
        },
        secInsID: {
            type: DataTypes.STRING,
            allowNull: true
        },
        secInsGroup: {
            type: DataTypes.STRING,
            allowNull: true
        },
        secInsType: {
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
        address2Street: {
            type: DataTypes.STRING,
            allowNull: true
        },
        address2City: {
            type: DataTypes.STRING,
            allowNull: true
        },
        address2State: {
            type: DataTypes.STRING,
            allowNull: true
        },
        address2ZipCode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        address3Street: {
            type: DataTypes.STRING,
            allowNull: true
        },
        address3City: {
            type: DataTypes.STRING,
            allowNull: true
        },
        address3State: {
            type: DataTypes.STRING,
            allowNull: true
        },
        address3ZipCode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone2: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone3: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }); 
    
    Patients.associate = function(models) {
        models.Patients.hasMany(models.Scripts, {
            onDelete: "cascade"
        }),
        models.Patients.hasMany(models.patientNotes, {
            onDelete: "cascade"
        }),
        models.Patients.hasMany(models.pastInsurance, {
            onDelete: "cascade"
        })
    };
    return Patients; 
  };