module.exports = (sequelize, DataTypes) => {
  const SolicitudesServicio = sequelize.define("solicitudesServicio", {
    canchaId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "aceptado", "rechazado", "asignado", "completado"),
      defaultValue: "pendiente"
    },
    proveedorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'proveedores',
        key: 'id'
      }
    }
  }, {
    tableName: "solicitudesServicio"
  });

  SolicitudesServicio.associate = (models) => {
    SolicitudesServicio.hasMany(models.historialMantenimiento, {
      foreignKey: "solicitudId",
      as: "mantenimientos"
    });

    SolicitudesServicio.belongsTo(models.proveedores, {
      foreignKey: "proveedorId",
      as: "proveedor"
    });
  };

  return SolicitudesServicio;
};
