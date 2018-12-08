
module.exports = function (sequelize, DataTypes) {
    var Faxes = sequelize.define("Faxes", {
        fileName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
     
    });
  
    return Faxes;
};