module.exports = (sequelize, DataTypes) => {
  const CalificacionesProveedor = sequelize.define('calificacionesProveedor', {
    proveedorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    puntuacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'calificacionesProveedor',
    timestamps: true
  });

  CalificacionesProveedor.associate = (models) => {
    CalificacionesProveedor.belongsTo(models.proveedores, {
      foreignKey: 'proveedorId',
      as: 'proveedor'
    });
  };

  return CalificacionesProveedor;
};
