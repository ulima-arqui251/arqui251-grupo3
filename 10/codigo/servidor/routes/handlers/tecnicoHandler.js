module.exports = {
  asignarTarea: (solicitud, proveedor) => {
    return {
      detalle: `🛠 Técnico ${proveedor.nombre} asignado a la solicitud #${solicitud.id} para reparación de cancha.`
    };
  }
};
