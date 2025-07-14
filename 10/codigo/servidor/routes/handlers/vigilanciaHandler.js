module.exports = {
  asignarTarea: (solicitud, proveedor) => {
    return {
      detalle: `👮 Personal de vigilancia ${proveedor.nombre} asignado a la solicitud #${solicitud.id}.`
    };
  }
};
