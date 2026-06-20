import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { peliculasServicio } from '../servicios/servicios';
import { useAuth } from '../contextos/AutenticacionContexto';
import { MdAccessTime, MdCalendarMonth, MdEventSeat, MdMovie } from 'react-icons/md';

const API_URL = 'http://localhost:3000';

export default function DetallePeliculaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { estaAutenticado } = useAuth();
  const [pelicula, setPelicula] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarPelicula();
  }, [id]);

  const cargarPelicula = async () => {
    try {
      const { data } = await peliculasServicio.obtenerPorId(id);
      setPelicula(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long', day: 'numeric', month: 'long',
    });
  };

  const formatearHora = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (cargando) {
    return (
      <div className="main-content">
        <div className="loading-container">
          <div className="spinner" />
          <span className="loading-text">Cargando película...</span>
        </div>
      </div>
    );
  }

  if (!pelicula) {
    return (
      <div className="main-content">
        <div className="empty-state">
          <h3>Película no encontrada</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content fade-in">
      {/* Hero con fondo borroso */}
      <div className="movie-detail-hero">
        <div
          className="hero-bg"
          style={{
            backgroundImage: pelicula.imagenUrl
              ? `url(${API_URL}${pelicula.imagenUrl})`
              : 'none',
          }}
        />
        <div className="hero-overlay" />

        <div className="container">
          <div className="movie-detail-content">
            <div className="movie-detail-poster">
              {pelicula.imagenUrl ? (
                <img src={`${API_URL}${pelicula.imagenUrl}`} alt={pelicula.titulo} />
              ) : (
                <div className="poster-placeholder">
                  <MdMovie />
                </div>
              )}
            </div>

            <div className="movie-detail-info">
              <button 
                onClick={() => navigate(-1)}
                className="btn-back"
                title="Volver a Cartelera"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                <span>Volver</span>
              </button>
              <h1 style={{ margin: 0, marginBottom: '1rem' }}>{pelicula.titulo}</h1>
              <div className="movie-badges">
                <span className="badge badge-genre">{pelicula.genero}</span>
                <span className="badge badge-rating">{pelicula.clasificacion}</span>
                <span className="badge badge-duration">
                  <MdAccessTime /> {pelicula.duracionMinutos} min
                </span>
              </div>
              <p className="synopsis">{pelicula.sinopsis}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Funciones disponibles */}
      <div className="container page-section">
        <h2 className="page-title" style={{ fontSize: '1.5rem' }}>
          <MdCalendarMonth style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Funciones Disponibles
        </h2>

        {pelicula.funciones && pelicula.funciones.length > 0 ? (
          <div className="functions-list" style={{ marginTop: 20 }}>
            {pelicula.funciones.map((funcion) => (
              <div
                key={funcion.id}
                className="function-card"
                onClick={() => {
                  if (estaAutenticado) {
                    navigate(`/reserva/${funcion.id}`);
                  } else {
                    navigate('/login');
                  }
                }}
              >
                <div className="function-info">
                  <div className="function-datetime">
                    <div className="date">{formatearFecha(funcion.fechaHora)}</div>
                    <div className="time">{formatearHora(funcion.fechaHora)}</div>
                  </div>
                  <div className="function-details">
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <MdEventSeat style={{ verticalAlign: 'middle', marginRight: 4 }} />
                      {funcion.sala?.nombre || 'Sala'}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span className="function-price">Bs. {funcion.precio}</span>
                  <button className="btn btn-primary btn-sm">Reservar</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No hay funciones disponibles</h3>
            <p>Próximamente se agregarán nuevas funciones</p>
          </div>
        )}
      </div>
    </div>
  );
}
