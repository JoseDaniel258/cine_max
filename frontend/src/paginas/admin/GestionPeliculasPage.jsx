import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { peliculasServicio } from '../../servicios/servicios';
import { MdAdd, MdEdit, MdDelete, MdArrowBack } from 'react-icons/md';
import toast from 'react-hot-toast';

const GENEROS = [
  'Acción', 'Comedia', 'Drama', 'Terror', 'Ciencia Ficción',
  'Romance', 'Animación', 'Aventura', 'Suspenso', 'Fantasía'
];

export default function GestionPeliculasPage() {
  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    id: null,
    titulo: '',
    sinopsis: '',
    genero: GENEROS[0],
    duracionMinutos: '',
    clasificacion: '',
    imagen: null
  });

  useEffect(() => {
    cargarPeliculas();
  }, []);

  const cargarPeliculas = async () => {
    try {
      setCargando(true);
      const { data } = await peliculasServicio.listarTodas();
      setPeliculas(data);
    } catch (error) {
      toast.error('Error al cargar películas');
    } finally {
      setCargando(false);
    }
  };

  const abrirModal = (pelicula = null) => {
    if (pelicula) {
      setFormData({
        id: pelicula.id,
        titulo: pelicula.titulo,
        sinopsis: pelicula.sinopsis,
        genero: pelicula.genero,
        duracionMinutos: pelicula.duracionMinutos,
        clasificacion: pelicula.clasificacion,
        imagen: null
      });
    } else {
      setFormData({
        id: null,
        titulo: '',
        sinopsis: '',
        genero: GENEROS[0],
        duracionMinutos: '',
        clasificacion: '',
        imagen: null
      });
    }
    setModalAbierto(true);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('titulo', formData.titulo);
    data.append('sinopsis', formData.sinopsis);
    data.append('genero', formData.genero);
    data.append('duracionMinutos', formData.duracionMinutos);
    data.append('clasificacion', formData.clasificacion);
    if (formData.imagen) {
      data.append('imagen', formData.imagen);
    }

    try {
      if (formData.id) {
        await peliculasServicio.actualizar(formData.id, data);
        toast.success('Película actualizada');
      } else {
        await peliculasServicio.crear(data);
        toast.success('Película creada');
      }
      setModalAbierto(false);
      cargarPeliculas();
    } catch (error) {
      toast.error('Error al guardar la película');
    }
  };

  const eliminarPelicula = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta película?')) {
      try {
        await peliculasServicio.eliminar(id);
        toast.success('Película eliminada');
        cargarPeliculas();
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
            <h1 className="page-title">Gestión de Películas</h1>
            <p className="page-subtitle" style={{ marginBottom: 0 }}>Administra el catálogo de películas</p>
          </div>
          <button className="btn btn-primary" onClick={() => abrirModal()}>
            <MdAdd /> Nueva Película
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
                  <th>Título</th>
                  <th>Género</th>
                  <th>Duración</th>
                  <th>Clasificación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {peliculas.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{p.titulo}</td>
                    <td><span className="badge badge-genre">{p.genero}</span></td>
                    <td>{p.duracionMinutos} min</td>
                    <td>{p.clasificacion}</td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-icon btn-secondary" onClick={() => abrirModal(p)} title="Editar">
                          <MdEdit />
                        </button>
                        <button className="btn btn-icon btn-danger" onClick={() => eliminarPelicula(p.id)} title="Eliminar">
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

        {modalAbierto && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>{formData.id ? 'Editar Película' : 'Nueva Película'}</h2>
              <form onSubmit={manejarEnvio}>
                <div className="form-group">
                  <label className="form-label">Título</label>
                  <input type="text" className="form-input" required 
                    value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Sinopsis</label>
                  <textarea className="form-textarea" required 
                    value={formData.sinopsis} onChange={e => setFormData({...formData, sinopsis: e.target.value})} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Género</label>
                    <select className="form-select" required
                      value={formData.genero} onChange={e => setFormData({...formData, genero: e.target.value})}>
                      {GENEROS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Duración (min)</label>
                    <input type="number" className="form-input" required min="1"
                      value={formData.duracionMinutos} onChange={e => setFormData({...formData, duracionMinutos: e.target.value})} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Clasificación</label>
                  <input type="text" className="form-input" required placeholder="Ej: Todo público, +14, R"
                    value={formData.clasificacion} onChange={e => setFormData({...formData, clasificacion: e.target.value})} />
                </div>

                <div className="form-group">
                  <label className="form-label">Póster (Imagen)</label>
                  <input type="file" className="form-input" accept="image/*"
                    onChange={e => setFormData({...formData, imagen: e.target.files[0]})} />
                  {formData.id && !formData.imagen && <small style={{color: 'var(--text-muted)'}}>Dejar vacío para mantener la imagen actual</small>}
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
