import './App.css';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './PaginasUsuario/LandingPage';
import ConfirmationPage from './pages/PaginaConfirmación/ConfirmationPage';
import RegisterPageCliente from './pages/PaginaRegistroUsuario/RegisterPage2';
import RegisterPageFreelancer from './pages/PaginaRegistroEntidad/RegisterPage';
import RegisterAdmin from './pages/PaginaRegistroUsuario/RegisterAdmin';
import LoginPage1 from './pages/Login/LoginPage1';
import Pie from './ComponentesGeneral/footer';
import Header from './ComponentesGeneral/header';
import Sidebar from './pages/Sidebar/SidebarMenu'; // ← Sidebar agregado

import DashboardUsuario from './Modulos/GestionUsuarios/DashboardUsuario';
import DashboardEntidad from './Modulos/GestionUsuarios/DashboardEntidad';
import EditarPerfil from './Modulos/GestionUsuarios/EditarPerfil';
import HistorialReservas from './Modulos/Reservas/MisReservasPage';
import WizardRecuperacion from './Modulos/GestionUsuarios/RecuperarCuenta/WizardRecuperacion';
import PanelProveedores from './Modulos/Proveedores&Mantenimiento/PanelProveedores';
import AdminPoliPage from './Modulos/Reservas/AdminCanchasPage';
import AdminCanchasPage from './Modulos/Reservas/CrearCanchasPorPolideportivo';
import VerPoliPage from './Modulos/Reservas/VerPolideportivos';
import ReservarPolideportivo from './Modulos/Reservas/ReservarPolideportivo';

import PagarReservaPage from './Modulos/Pagos/PagarReservaPage';
import FacturaPage from './Modulos/Pagos/FacturaPage';

function App() {
  return (
    <div className="App">
      <Sidebar /> {/* ✅ Sidebar visible siempre */}
      <Header />
      <main style={{ paddingLeft: '240px' }}> {/* espacio para el sidebar */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register/usuario" element={<RegisterPageCliente />} />
          <Route path="/register/entidad" element={<RegisterPageFreelancer />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/usuario/login" element={<LoginPage1 />} />
          <Route path="/dashboard/usuario/:id" element={<DashboardUsuario />} />
          <Route path="/dashboard/entidad/:id" element={<DashboardEntidad />} />
          <Route path="/editar-perfil/:id" element={<EditarPerfil />} />
          <Route path="/historial/:id" element={<HistorialReservas />} />
          <Route path="/recuperar-password" element={<WizardRecuperacion />} />
          <Route path="/Admin" element={<RegisterAdmin  />} />
          <Route path="/Admin/provedores" element={<PanelProveedores  />} />
          <Route path="/Admin/Poli" element={<AdminPoliPage  />} />
          <Route path="/Admin/canchas" element={<AdminCanchasPage  />} />
          <Route path="/Admin/Poli/ver" element={<VerPoliPage  />} />
          <Route path="/reservar/polideportivo/:id" element={<ReservarPolideportivo />} />
          <Route path="/pago/:id" element={<PagarReservaPage />} />
          <Route path="/factura/:id" element={<FacturaPage />} />
        </Routes>
      </main>
      <Pie />
    </div>
  );
}

export default App;

