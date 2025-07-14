module.exports = {
  validar(data) {
    const errores = [];

    if (!data.identidad || !/^\d{11}$/.test(data.identidad)) {
      errores.push("El RUC debe tener exactamente 11 dígitos.");
    }

    if (data.ubigeo && !/^\d{6}$/.test(data.ubigeo)) {
      errores.push("Ubigeo inválido (debe tener 6 dígitos).");
    }

    if (!data.correo || !/^[^@]+@[^@]+\.[^@]+$/.test(data.correo)) {
      errores.push("Correo electrónico inválido.");
    }

    return errores;
  }
};
