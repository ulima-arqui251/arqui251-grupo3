module.exports = (sequelize, DataTypes) => {
  const Pagos = sequelize.define('pagos', {
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    metodo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'completado', 'fallido', 'pagado'),
      defaultValue: 'pendiente'
    },
    referencia: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'pagos'
  });

  Pagos.associate = models => {
    Pagos.belongsTo(models.reservas, { foreignKey: 'reservaId' });
  };

  return Pagos;
};
