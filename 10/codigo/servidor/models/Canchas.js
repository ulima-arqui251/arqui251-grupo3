module.exports = (sequelize, DataTypes) => {
  const Canchas = sequelize.define('canchas', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('disponible', 'no disponible'),
      defaultValue: 'disponible'
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    techado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    iluminacion: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'canchas'
  });

  Canchas.associate = models => {
    Canchas.belongsTo(models.polideportivos, { foreignKey: 'polideportivoId' });
    Canchas.hasMany(models.reservas, { foreignKey: 'canchaId' });
  };

  return Canchas;
};
