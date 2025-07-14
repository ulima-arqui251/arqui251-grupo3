module.exports = (sequelize, DataTypes) => {
  const HistorialMantenimiento = sequelize.define("historialMantenimiento", {
    solicitudId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    proveedorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false
    },
    detalle: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: "historialMantenimiento"
  });

  HistorialMantenimiento.associate = (models) => {
    HistorialMantenimiento.belongsTo(models.solicitudesServicio, {
      foreignKey: "solicitudId",
      as: "solicitud"
    });

    HistorialMantenimiento.belongsTo(models.proveedores, {
      foreignKey: "proveedorId",
      as: "proveedor"
    });
  };

  return HistorialMantenimiento;
};
