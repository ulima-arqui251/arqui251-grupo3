module.exports = (sequelize, DataTypes) => {
  const Polideportivos = sequelize.define('polideportivos', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ubicacionLat: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    ubicacionLng: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'polideportivos'
  });

  Polideportivos.associate = models => {
    Polideportivos.hasMany(models.canchas, { foreignKey: 'polideportivoId' });
  };

  return Polideportivos;
};
