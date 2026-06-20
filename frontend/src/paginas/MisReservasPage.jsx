import { useState, useEffect } from 'react';
import { reservasServicio } from '../servicios/servicios';
import { MdConfirmationNumber, MdCalendarMonth, MdEventSeat, MdMovie } from 'react-icons/md';

const API_URL = 'http://localhost:3000';

export default function MisReservasPage() {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      const { data } = await reservasServicio.misReservas();
      setReservas(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div className="main-content">
        <div className="loading-container">
          <div className="spinner" />
          <span className="loading-text">Cargando tus reservas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content fade-in">
      <div className="container page-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <button 
            onClick={() => window.history.back()}
            className="btn-back"
            style={{ marginBottom: 0 }}
            title="Volver"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <h1 className="page-title" style={{ marginBottom: 0 }}>
            <MdConfirmationNumber style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Mis Reservas
          </h1>
        </div>
        <p className="page-subtitle">Historial de todas tus reservas realizadas</p>

        {reservas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎟️</div>
            <h3>No tienes reservas aún</h3>
            <p>Explora la cartelera y reserva tus entradas</p>
          </div>
        ) : (
          <div className="reservations-list">
            {reservas.map((reserva) => (
              <div key={reserva.id} className="reservation-card">
                <div className="res-poster">
                  {reserva.funcion?.pelicula?.imagenUrl ? (
                    <img
                      src={`${API_URL}${reserva.funcion.pelicula.imagenUrl}`}
                      alt={reserva.funcion.pelicula.titulo}
                    />
                  ) : (
                    <div className="poster-placeholder" style={{ fontSize: '1.5rem' }}>
                      <MdMovie />
                    </div>
                  )}
                </div>
                <div className="res-info">
                  <h4>{reserva.funcion?.pelicula?.titulo || 'Película'}</h4>
                  <div className="res-details">
                    <span className="res-detail-item">
                      <MdCalendarMonth />
                      {new Date(reserva.funcion?.fechaHora).toLocaleDateString('es-ES', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                      {' - '}
                      {new Date(reserva.funcion?.fechaHora).toLocaleTimeString('es-ES', {
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                    <span className="res-detail-item">
                      <MdEventSeat />
                      {reserva.funcion?.sala?.nombre}
                    </span>
                    <span className="res-detail-item">
                      🎟️ {reserva.cantidadAsientos} entrada(s)
                    </span>
                  </div>
                  <div className="res-seats">
                    {reserva.asientos?.map((asiento) => (
                      <span key={asiento.id} className="seat-tag">
                        {asiento.codigoAsiento}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
