const tecnicoHandler = require('./handlers/tecnicoHandler');
const limpiezaHandler = require('./handlers/limpiezaHandler');
const vigilanciaHandler = require('./handlers/vigilanciaHandler');

const handlerMap = {
  tecnico: tecnicoHandler,
  limpieza: limpiezaHandler,
  vigilancia: vigilanciaHandler
};

const getProviderHandler = (especialidad) => {
  return handlerMap[especialidad?.toLowerCase()] || tecnicoHandler; // Por defecto técnico
};

module.exports = getProviderHandler;
