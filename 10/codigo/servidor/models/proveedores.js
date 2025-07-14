module.exports = (sequelize, DataTypes) => {
  const Proveedores = sequelize.define('proveedores', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    especialidad: {
      type: DataTypes.STRING,
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'proveedores',
    timestamps: true
  });

  Proveedores.associate = (models) => {
    Proveedores.hasMany(models.calificacionesProveedor, {
      foreignKey: 'proveedorId',
      as: 'calificaciones'
    });
  };

  return Proveedores;
};
