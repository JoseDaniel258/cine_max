import { Link } from 'react-router-dom';
import { MdMovie, MdEventSeat, MdCalendarMonth } from 'react-icons/md';

export default function PanelAdminPage() {
  return (
    <div className="main-content fade-in">
      <div className="container page-section">
        <h1 className="page-title">Panel de Administración</h1>
        <p className="page-subtitle">Gestiona todos los aspectos de la cadena de cines</p>

        <div className="movies-grid" style={{ marginTop: 40 }}>
          <Link to="/admin/peliculas">
            <div className="card" style={{ padding: 32, textAlign: 'center', cursor: 'pointer' }}>
              <MdMovie style={{ fontSize: '4rem', color: 'var(--color-primary)', marginBottom: 16 }} />
              <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)' }}>Películas</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.9rem' }}>
                Añadir, editar o eliminar películas de la cartelera
              </p>
            </div>
          </Link>

          <Link to="/admin/salas">
            <div className="card" style={{ padding: 32, textAlign: 'center', cursor: 'pointer' }}>
              <MdEventSeat style={{ fontSize: '4rem', color: 'var(--color-primary)', marginBottom: 16 }} />
              <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)' }}>Salas</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.9rem' }}>
                Configurar salas y capacidad de asientos
              </p>
            </div>
          </Link>

          <Link to="/admin/funciones">
            <div className="card" style={{ padding: 32, textAlign: 'center', cursor: 'pointer' }}>
              <MdCalendarMonth style={{ fontSize: '4rem', color: 'var(--color-primary)', marginBottom: 16 }} />
              <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)' }}>Funciones</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.9rem' }}>
                Programar horarios y asignar películas a las salas
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
