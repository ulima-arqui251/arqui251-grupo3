// services/handlers/limpiezaHandler.js
module.exports = {
  asignarTarea: (solicitud, proveedor) => {
    return {
      detalle: `🧹 Limpieza asignada a cancha ${solicitud.canchaId} para el día ${new Date().toLocaleDateString()}`
    };
  }
};
