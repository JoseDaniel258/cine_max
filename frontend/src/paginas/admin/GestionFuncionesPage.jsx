import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { funcionesServicio, peliculasServicio, salasServicio } from '../../servicios/servicios';
import { MdAdd, MdEdit, MdDelete, MdArrowBack } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function GestionFuncionesPage() {
  const [funciones, setFunciones] = useState([]);
  const [peliculas, setPeliculas] = useState([]);
  const [salas, setSalas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null,
    peliculaId: '',
    salaId: '',
    fechaHora: '',
    precio: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [resFunciones, resPelis, resSalas] = await Promise.all([
        funcionesServicio.listarTodas(),
        peliculasServicio.listarTodas(),
        salasServicio.listarTodas()
      ]);
      setFunciones(resFunciones.data);
      setPeliculas(resPelis.data);
      setSalas(resSalas.data);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setCargando(false);
    }
  };

  const formatearFechaParaInput = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  const abrirModal = (funcion = null) => {
    if (funcion) {
      setFormData({
        id: funcion.id,
        peliculaId: funcion.peliculaId,
        salaId: funcion.salaId,
        fechaHora: formatearFechaParaInput(funcion.fechaHora),
        precio: funcion.precio
      });
    } else {
      setFormData({
        id: null,
        peliculaId: peliculas[0]?.id || '',
        salaId: salas[0]?.id || '',
        fechaHora: '',
        precio: ''
      });
    }
    setModalAbierto(true);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    const payload = {
      peliculaId: parseInt(formData.peliculaId),
      salaId: parseInt(formData.salaId),
      fechaHora: new Date(formData.fechaHora).toISOString(),
      precio: parseFloat(formData.precio)
    };

    try {
      if (formData.id) {
        await funcionesServicio.actualizar(formData.id, payload);
        toast.success('Función actualizada');
      } else {
        await funcionesServicio.crear(payload);
        toast.success('Función creada');
      }
      setModalAbierto(false);
      cargarDatos();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar la función. Verifica solapamientos.');
    }
  };

  const eliminarFuncion = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta función?')) {
      try {
        await funcionesServicio.eliminar(id);
        toast.success('Función eliminada');
        cargarDatos();
      } catch (error) {
        toast.error('Error al eliminar. Puede tener reservas asociadas.');
      }
    }
  };

  return (
    <div className="main-content fade-in">
      <div className="container page-section">
        <Link to="/admin" className="btn-back" style={{ textDecoration: 'none' }}>
          <MdArrowBack /> Volver al Panel
        </Link>
        
        <div className="admin-header">
          <div>
            <h1 className="page-title">Gestión de Funciones</h1>
            <p className="page-subtitle" style={{ marginBottom: 0 }}>Programa los horarios de proyección</p>
          </div>
          <button className="btn btn-primary" onClick={() => abrirModal()} disabled={peliculas.length === 0 || salas.length === 0}>
            <MdAdd /> Nueva Función
          </button>
        </div>

        {cargando ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Película</th>
                  <th>Sala</th>
                  <th>Fecha y Hora</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {funciones.map(f => (
                  <tr key={f.id}>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{f.pelicula?.titulo}</td>
                    <td>{f.sala?.nombre}</td>
                    <td>
                      {new Date(f.fechaHora).toLocaleString('es-ES', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td>Bs. {f.precio}</td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-icon btn-secondary" onClick={() => abrirModal(f)} title="Editar">
                          <MdEdit />
                        </button>
                        <button className="btn btn-icon btn-danger" onClick={() => eliminarFuncion(f.id)} title="Eliminar">
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Formulario */}
        {modalAbierto && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>{formData.id ? 'Editar Función' : 'Nueva Función'}</h2>
              <form onSubmit={manejarEnvio}>
                
                <div className="form-group">
                  <label className="form-label">Película</label>
                  <select className="form-select" required
                    value={formData.peliculaId} onChange={e => setFormData({...formData, peliculaId: e.target.value})}>
                    {peliculas.map(p => <option key={p.id} value={p.id}>{p.titulo}</option>)}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Sala</label>
                  <select className="form-select" required
                    value={formData.salaId} onChange={e => setFormData({...formData, salaId: e.target.value})}>
                    {salas.map(s => <option key={s.id} value={s.id}>{s.nombre} (Cap: {s.capacidadTotal})</option>)}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Fecha y Hora</label>
                    <input type="datetime-local" className="form-input" required 
                      value={formData.fechaHora} onChange={e => setFormData({...formData, fechaHora: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Precio (Bs.)</label>
                    <input type="number" className="form-input" required min="0" step="0.01"
                      value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} />
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setModalAbierto(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
