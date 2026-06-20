import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contextos/AutenticacionContexto';
import { MdMovie, MdLogout, MdPerson, MdAdminPanelSettings } from 'react-icons/md';

export default function BarraNavegacion() {
  const { usuario, estaAutenticado, esAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <MdMovie className="logo-icon" />
          CineMax
        </Link>

        <div className="navbar-links">
          <Link to="/" className="navbar-link">Cartelera</Link>
          {estaAutenticado && (
            <Link to="/mis-reservas" className="navbar-link">Mis Reservas</Link>
          )}
          {esAdmin && (
            <Link to="/admin" className="navbar-link">
              <MdAdminPanelSettings style={{ marginRight: 4 }} />
              Admin
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          {estaAutenticado ? (
            <>
              <div className="navbar-user">
                <span className="user-avatar">
                  {usuario.nombre.charAt(0).toUpperCase()}
                </span>
                <span>{usuario.nombre}</span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                <MdLogout />
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Iniciar Sesión
              </Link>
              <Link to="/registro" className="btn btn-primary btn-sm">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
