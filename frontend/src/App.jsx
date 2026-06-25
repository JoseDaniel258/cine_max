import { Routes, Route } from 'react-router-dom';
import BarraNavegacion from './componentes/comunes/BarraNavegacion';
import RutaProtegida from './componentes/comunes/RutaProtegida';

import CarteleraPage from './paginas/CarteleraPage';
import DetallePeliculaPage from './paginas/DetallePeliculaPage';
import LoginPage from './paginas/LoginPage';
import RegistroPage from './paginas/RegistroPage';

import ReservaPage from './paginas/ReservaPage';
import MisReservasPage from './paginas/MisReservasPage';

import PanelAdminPage from './paginas/admin/PanelAdminPage';
import GestionPeliculasPage from './paginas/admin/GestionPeliculasPage';
import GestionSalasPage from './paginas/admin/GestionSalasPage';
import GestionFuncionesPage from './paginas/admin/GestionFuncionesPage';

function App() {
  return (
    <div className="app-container">
      <BarraNavegacion />
      
      <Routes>
        <Route path="/" element={<CarteleraPage />} />
        <Route path="/pelicula/:id" element={<DetallePeliculaPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />

        <Route 
          path="/reserva/:funcionId" 
          element={
            <RutaProtegida>
              <ReservaPage />
            </RutaProtegida>
          } 
        />
        <Route 
          path="/mis-reservas" 
          element={
            <RutaProtegida>
              <MisReservasPage />
            </RutaProtegida>
          } 
        />

        <Route 
          path="/admin" 
          element={
            <RutaProtegida requiereAdmin={true}>
              <PanelAdminPage />
            </RutaProtegida>
          } 
        />
        <Route 
          path="/admin/peliculas" 
          element={
            <RutaProtegida requiereAdmin={true}>
              <GestionPeliculasPage />
            </RutaProtegida>
          } 
        />
        <Route 
          path="/admin/salas" 
          element={
            <RutaProtegida requiereAdmin={true}>
              <GestionSalasPage />
            </RutaProtegida>
          } 
        />
        <Route 
          path="/admin/funciones" 
          element={
            <RutaProtegida requiereAdmin={true}>
              <GestionFuncionesPage />
            </RutaProtegida>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
