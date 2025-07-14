module.exports = (sequelize, DataTypes) => {
  const Notificaciones = sequelize.define('notificaciones', {
    mensaje: DataTypes.STRING,
    tipo: DataTypes.ENUM('reserva', 'pago', 'cancelacion', 'servicio'),
    metodoEnvio: DataTypes.ENUM('correo', 'push', 'sms'),
    leido: { type: DataTypes.BOOLEAN, defaultValue: false },
  });

  Notificaciones.associate = models => {
    Notificaciones.belongsTo(models.usuarios, { foreignKey: 'usuarioId' });
  };

  return Notificaciones;
};
