module.exports = (sequelize, DataTypes) => {
  const Reservas = sequelize.define('reservas', {
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fechaFin: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    horaInicio: {
      type: DataTypes.TIME,
      allowNull: false
    },
    horaFin: {
      type: DataTypes.TIME,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'aprobada', 'cancelada', 'pagado'), // 👈 Agregado 'pagado'
      defaultValue: 'pendiente'
    },
    notas: {
      type: DataTypes.STRING,
      allowNull: true
    },
    precioTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    }
  }, {
    tableName: 'reservas',
    timestamps: true
  });

  Reservas.associate = models => {
    Reservas.belongsTo(models.canchas, { foreignKey: 'canchaId' });
    Reservas.belongsTo(models.usuarios, { foreignKey: 'usuarioId' });

    // 👇 Historial de pagos (una reserva puede tener múltiples intentos/fallos)
    Reservas.hasMany(models.pagos, { foreignKey: 'reservaId', as: 'historialPagos' });
  };

  return Reservas;
};
