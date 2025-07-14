const { DataTypes } = require("sequelize");
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const usuarios = sequelize.define("usuarios", {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false
    },
    identidad: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('entidad', 'usuario', 'Admin'),
      allowNull: false
    },
    especialidad: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fotoPerfil: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    tableName: 'usuarios'
  });

  usuarios.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  return usuarios;
};
