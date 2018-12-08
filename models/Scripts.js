
module.exports = function(sequelize, DataTypes) {
    var Scripts = sequelize.define("Scripts", {
        processedOn: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        patient: {
            type: DataTypes.STRING,
            allowNull: true
        },
        pouch: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        pharmNPI: {
            type: DataTypes.STRING,
            allowNull: true
        },
        priorAuth: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        pharmDate: {
            type: DataTypes.STRING,
            allowNull: true
        },
        writtenDate: {
            type: DataTypes.STRING,
            allowNull: true
        },
        salesCode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        billOnDate: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cost: {
            type: DataTypes.STRING,
            allowNull: true
        },
        rxNumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        primInsPay: {
            type: DataTypes.STRING,
            allowNull: true
        },
        diagnosis: {
            type: DataTypes.STRING,
            allowNull: true
        },
        secInsPay: {
            type: DataTypes.STRING,
            allowNull: true
        },
        secDiagnosis: {
            type: DataTypes.STRING,
            allowNull: true
        },
        patientPay: {
            type: DataTypes.STRING,
            allowNull: true
        },
        refills: {
            type: DataTypes.STRING,
            allowNull: true
        },
        refillsRemaining: {
            type: DataTypes.STRING,
            allowNull: true
        },
        quantity: {
            type: DataTypes.STRING,
            allowNull: true
        },
        daysSupply: {
            type: DataTypes.STRING,
            allowNull: true
        },
        directions: {
            type: DataTypes.STRING,
            allowNull: true
        },
        copayApproval: {
            type: DataTypes.STRING,
            allowNull: true
        },
        copayNetwork: {
            type: DataTypes.STRING,
            allowNull: true
        },
        networkPay: {
            type: DataTypes.STRING,
            allowNull: true
        },
        homeCare: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        hcHome: {
            type: DataTypes.STRING,
            allowNull: true
        },
        hcPhone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cancelReason: {
            type: DataTypes.STRING,
            allowNull: true
        },
        transLocation: {
            type: DataTypes.STRING,
            allowNull: true
        },
        transNPI: {
            type: DataTypes.STRING,
            allowNull: true
        },
        transDate: {
            type: DataTypes.STRING,
            allowNull: true
        },
        shipOn: {
            type: DataTypes.STRING,
            allowNull: true
        },
        deliveryMethod: {
            type: DataTypes.STRING,
            allowNull: true
        },
        trackNum: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ETA: {
            type: DataTypes.STRING,
            allowNull: true
        },
        paymentOption: {
            type: DataTypes.STRING,
            allowNull: true
        },
        notesUpdated: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }); 

    Scripts.associate = function(models) {
        models.Scripts.belongsTo(models.Patients, {
            foreignKey: {
                allowNull: false
            }
        }),
        models.Scripts.belongsTo(models.Physicians, {
            foreignKey: {
                allowNull: false
            }
        }),
        models.Scripts.belongsTo(models.Products, {
            foreignKey: {
                allowNull: false
            }
        }),
        models.Scripts.hasMany(models.scriptNotes, {
            onDelete: "cascade"
        })
        models.Scripts.hasMany(models.scriptAttachments, {
            onDelete: "cascade"
        });
        models.Scripts.hasMany(models.scriptStatuses, {
            onDelete: "cascade"
        })
        
    };

    return Scripts; 
  };