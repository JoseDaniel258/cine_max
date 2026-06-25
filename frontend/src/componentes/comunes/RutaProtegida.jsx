import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contextos/AutenticacionContexto';


export default function RutaProtegida({ children, requiereAdmin = false }) {
  const { estaAutenticado, esAdmin, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <span className="loading-text">Cargando...</span>
      </div>
    );
  }

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  if (requiereAdmin && !esAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
