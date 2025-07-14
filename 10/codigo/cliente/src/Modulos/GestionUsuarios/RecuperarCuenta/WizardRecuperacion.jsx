import React, { useState } from 'react';
import Paso1Correo from './Paso1Correo';
import Paso2Codigo from './Paso2Codigo';
import Paso3NuevaClave from './Paso3NuevaClave';
import { useNavigate } from 'react-router-dom';

const WizardRecuperacion = () => {
  const [paso, setPaso] = useState(1);
  const [datos, setDatos] = useState({});
  const navigate = useNavigate();

  const avanzarPaso = (nuevosDatos) => {
    setDatos(prev => ({ ...prev, ...nuevosDatos }));
    setPaso(p => p + 1);
  };

  const finalizar = () => {
    alert('¡Contraseña actualizada exitosamente!');
    navigate('/login');
  };

  return (
    <div className="wizard-container">
      {paso === 1 && <Paso1Correo onNext={avanzarPaso} />}
      {paso === 2 && <Paso2Codigo correo={datos.correo} onNext={avanzarPaso} />}
      {paso === 3 && <Paso3NuevaClave correo={datos.correo} codigo={datos.codigo} onDone={finalizar} />}
    </div>
  );
};

export default WizardRecuperacion;
