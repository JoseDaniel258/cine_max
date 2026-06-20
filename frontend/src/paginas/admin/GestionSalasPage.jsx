import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { salasServicio } from '../../servicios/servicios';
import { MdAdd, MdEdit, MdDelete, MdArrowBack } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function GestionSalasPage() {
  const [salas, setSalas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null,
    nombre: '',
    filas: 10,
    columnas: 10
  });

  useEffect(() => {
    cargarSalas();
  }, []);

  const cargarSalas = async () => {
    try {
      setCargando(true);
      const { data } = await salasServicio.listarTodas();
      setSalas(data);
    } catch (error) {
      toast.error('Error al cargar salas');
    } finally {
      setCargando(false);
    }
  };

  const abrirModal = (sala = null) => {
    if (sala) {
      setFormData({
        id: sala.id,
        nombre: sala.nombre,
        filas: sala.filas,
        columnas: sala.columnas
      });
    } else {
      setFormData({
        id: null,
        nombre: '',
        filas: 10,
        columnas: 10
      });
    }
    setModalAbierto(true);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    const payload = {
      nombre: formData.nombre,
      filas: parseInt(formData.filas),
      columnas: parseInt(formData.columnas)
    };

    try {
      if (formData.id) {
        await salasServicio.actualizar(formData.id, payload);
        toast.success('Sala actualizada');
      } else {
        await salasServicio.crear(payload);
        toast.success('Sala creada');
      }
      setModalAbierto(false);
      cargarSalas();
    } catch (error) {
      toast.error('Error al guardar la sala');
    }
  };

  const eliminarSala = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta sala?')) {
      try {
        await salasServicio.eliminar(id);
        toast.success('Sala eliminada');
        cargarSalas();
      } catch (error) {
        toast.error('Error al eliminar. Puede tener funciones asociadas.');
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
            <h1 className="page-title">Gestión de Salas</h1>
            <p className="page-subtitle" style={{ marginBottom: 0 }}>Administra las salas de cine y su capacidad</p>
          </div>
          <button className="btn btn-primary" onClick={() => abrirModal()}>
            <MdAdd /> Nueva Sala
          </button>
        </div>

        {cargando ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Filas</th>
                  <th>Columnas</th>
                  <th>Capacidad Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {salas.map(s => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{s.nombre}</td>
                    <td>{s.filas}</td>
                    <td>{s.columnas}</td>
                    <td><span className="badge badge-rating">{s.capacidadTotal} asientos</span></td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-icon btn-secondary" onClick={() => abrirModal(s)} title="Editar">
                          <MdEdit />
                        </button>
                        <button className="btn btn-icon btn-danger" onClick={() => eliminarSala(s.id)} title="Eliminar">
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
              <h2>{formData.id ? 'Editar Sala' : 'Nueva Sala'}</h2>
              <form onSubmit={manejarEnvio}>
                <div className="form-group">
                  <label className="form-label">Nombre de la Sala</label>
                  <input type="text" className="form-input" required 
                    value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Número de Filas</label>
                    <input type="number" className="form-input" required min="1" max="26"
                      value={formData.filas} onChange={e => setFormData({...formData, filas: e.target.value})} />
                    <small style={{color: 'var(--text-muted)'}}>Máximo 26 (A-Z)</small>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Asientos por Fila (Columnas)</label>
                    <input type="number" className="form-input" required min="1"
                      value={formData.columnas} onChange={e => setFormData({...formData, columnas: e.target.value})} />
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
