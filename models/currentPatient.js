
module.exports = function(sequelize, DataTypes) {
    var currentPatient = sequelize.define("currentPatient", {
        patientId: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }); 
   
    return currentPatient; 
  };