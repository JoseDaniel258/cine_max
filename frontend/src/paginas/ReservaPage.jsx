import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reservasServicio } from '../servicios/servicios';
import { MdEventSeat, MdCheckCircle } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function ReservaPage() {
  const { funcionId } = useParams();
  const navigate = useNavigate();
  const [datos, setDatos] = useState(null);
  const [seleccionados, setSeleccionados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [reservando, setReservando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarMapa();
  }, [funcionId]);

  const cargarMapa = async () => {
    try {
      const { data } = await reservasServicio.mapaAsientos(funcionId);
      setDatos(data);
    } catch (error) {
      toast.error('Error cargando el mapa de asientos');
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const toggleAsiento = (fila, columna, ocupado) => {
    if (ocupado) return;
    const key = `${fila}-${columna}`;
    setSeleccionados((prev) =>
      prev.find((s) => s.key === key)
        ? prev.filter((s) => s.key !== key)
        : [...prev, { key, fila, columna }]
    );
  };

  const estaSeleccionado = (fila, columna) => {
    return seleccionados.some((s) => s.fila === fila && s.columna === columna);
  };

  const procesarReserva = async () => {
    setMostrarModal(false);

    setReservando(true);
    try {
      await reservasServicio.crear({
        funcionId: parseInt(funcionId),
        asientos: seleccionados.map((s) => ({ fila: s.fila, columna: s.columna })),
      });
      toast.success('¡Reserva confirmada exitosamente!');
      navigate('/mis-reservas');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear la reserva');
    } finally {
      setReservando(false);
    }
  };

  if (cargando) {
    return (
      <div className="main-content">
        <div className="loading-container">
          <div className="spinner" />
          <span className="loading-text">Cargando mapa de asientos...</span>
        </div>
      </div>
    );
  }

  if (!datos) return null;

  const precioTotal = seleccionados.length * parseFloat(datos.funcion.precio);

  return (
    <div className="main-content fade-in">
      <div className="container page-section">
        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
          {/* Mapa de asientos */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <button 
                onClick={() => navigate(-1)}
                className="btn-back"
                style={{ marginBottom: 0 }}
                title="Volver"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </button>
              <h1 className="page-title" style={{ marginBottom: 0 }}>
                <MdEventSeat style={{ marginRight: 8, verticalAlign: 'middle' }} />
                Seleccionar Asientos
              </h1>
            </div>
            <p className="page-subtitle">
              {datos.sala.nombre} — {datos.asientosDisponibles} asientos disponibles
            </p>

            <div className="seat-map-container">
              {/* Pantalla */}
              <div className="screen" />
              <div className="screen-label">Pantalla</div>

              {/* Grid de asientos */}
              <div className="seat-grid">
                {datos.mapa.map((filaAsientos, filaIdx) => (
                  <div key={filaIdx} className="seat-row">
                    <span className="seat-row-label">
                      {String.fromCharCode(65 + filaIdx)}
                    </span>
                    {filaAsientos.map((asiento) => (
                      <div
                        key={asiento.codigo}
                        className={`seat ${
                          asiento.ocupado
                            ? 'occupied'
                            : estaSeleccionado(asiento.fila, asiento.columna)
                            ? 'selected'
                            : 'available'
                        }`}
                        onClick={() =>
                          toggleAsiento(asiento.fila, asiento.columna, asiento.ocupado)
                        }
                        title={asiento.ocupado ? 'Ocupado' : asiento.codigo}
                      >
                        {asiento.columna}
                      </div>
                    ))}
                    <span className="seat-row-label">
                      {String.fromCharCode(65 + filaIdx)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Leyenda */}
              <div className="seat-legend">
                <div className="seat-legend-item">
                  <div className="legend-dot" style={{ background: 'var(--seat-available)' }} />
                  Disponible
                </div>
                <div className="seat-legend-item">
                  <div className="legend-dot" style={{ background: 'var(--seat-selected)' }} />
                  Seleccionado
                </div>
                <div className="seat-legend-item">
                  <div className="legend-dot" style={{ background: 'var(--seat-occupied)', opacity: 0.5 }} />
                  Ocupado
                </div>
              </div>
            </div>
          </div>

          {/* Resumen de reserva */}
          <div style={{ width: 320, minWidth: 280 }}>
            <div className="reservation-summary">
              <h3>🎟️ Resumen de Reserva</h3>

              <div className="summary-row">
                <span>Sala</span>
                <span className="value">{datos.sala.nombre}</span>
              </div>
              <div className="summary-row">
                <span>Fecha</span>
                <span className="value">
                  {new Date(datos.funcion.fechaHora).toLocaleDateString('es-ES', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
              </div>
              <div className="summary-row">
                <span>Hora</span>
                <span className="value">
                  {new Date(datos.funcion.fechaHora).toLocaleTimeString('es-ES', {
                    hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="summary-row">
                <span>Precio unitario</span>
                <span className="value">Bs. {datos.funcion.precio}</span>
              </div>

              <hr className="summary-divider" />

              <div className="summary-row">
                <span>Asientos ({seleccionados.length})</span>
                <span className="value">
                  {seleccionados.length > 0
                    ? seleccionados
                        .map((s) => `${String.fromCharCode(64 + s.fila)}${s.columna}`)
                        .join(', ')
                    : 'Ninguno'}
                </span>
              </div>

              <hr className="summary-divider" />

              <div className="summary-total">
                <span>Total</span>
                <span className="total-price">Bs. {precioTotal.toFixed(2)}</span>
              </div>

              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: 20 }}
                onClick={() => setMostrarModal(true)}
                disabled={seleccionados.length === 0 || reservando}
              >
                <MdCheckCircle />
                Confirmar Reserva
              </button>
            </div>
          </div>
        </div>
      </div>

      {mostrarModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-secondary)', padding: 30, borderRadius: 16, width: '100%', maxWidth: 400, border: '1px solid var(--border-color)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <h2 className="text-2xl font-bold mb-4">Confirmar Pago</h2>
            <p className="mb-6 text-slate-300">
              Estás a punto de confirmar la compra de <strong>{seleccionados.length} asiento(s)</strong> por un total de <strong>Bs. {precioTotal.toFixed(2)}</strong>.
            </p>
            <div className="flex gap-4">
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1 }} 
                onClick={() => setMostrarModal(false)}
                disabled={reservando}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1 }} 
                onClick={procesarReserva}
                disabled={reservando}
              >
                {reservando ? 'Procesando...' : 'Pagar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
