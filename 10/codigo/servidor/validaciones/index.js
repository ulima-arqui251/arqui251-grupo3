const path = require("path");

function validarPorRegion(region) {
  // Cargar el módulo de validación de esa región
  const validador = require(path.join(__dirname, "regiones", region));

  // Middleware que ejecuta la validación
  return (req, res, next) => {
    const errores = validador.validar(req.body);

    if (errores.length > 0) {
      return res.status(400).json({
        error: "Validación fallida.",
        detalles: errores
      });
    }

    next();
  };
}

module.exports = {
  validarPorRegion
};
