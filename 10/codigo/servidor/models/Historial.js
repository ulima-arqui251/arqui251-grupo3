module.exports = (sequelize, DataTypes) => {
  const Historial = sequelize.define('historial', {
    tipo: DataTypes.STRING, // 'reserva', 'pago', 'cancelacion'
    descripcion: DataTypes.STRING,
  });

  Historial.associate = models => {
    Historial.belongsTo(models.usuarios, { foreignKey: 'usuarioId' });
  };

  return Historial;
};
