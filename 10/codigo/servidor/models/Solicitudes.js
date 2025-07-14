module.exports = (sequelize, DataTypes) => {
  const Solicitudes = sequelize.define('solicitudes', {
    descripcion: DataTypes.TEXT,
    estado: DataTypes.ENUM('pendiente', 'aceptada', 'rechazada', 'completada'),
  });

  Solicitudes.associate = models => {
    Solicitudes.belongsTo(models.canchas, { foreignKey: 'canchaId' });
    Solicitudes.belongsTo(models.proveedores, { foreignKey: 'proveedorId' });
  };

  return Solicitudes;
};
