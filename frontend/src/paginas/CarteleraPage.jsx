import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { peliculasServicio } from '../servicios/servicios';
import { MdSearch, MdAccessTime, MdMovie } from 'react-icons/md';

const GENEROS = [
  'Todos', 'Acción', 'Comedia', 'Drama', 'Terror',
  'Ciencia Ficción', 'Romance', 'Animación',
  'Aventura', 'Suspenso', 'Fantasía',
];

const API_URL = 'http://localhost:3000';

export default function CarteleraPage() {
  const [peliculas, setPeliculas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [generoActivo, setGeneroActivo] = useState('Todos');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarPeliculas();
  }, [busqueda, generoActivo]);

  const cargarPeliculas = async () => {
    try {
      setCargando(true);
      const genero = generoActivo === 'Todos' ? '' : generoActivo;
      const { data } = await peliculasServicio.listarTodas(busqueda, genero);
      setPeliculas(data);
    } catch (error) {
      console.error('Error cargando películas:', error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="main-content">
      <div className="container page-section fade-in">
        <h1 className="page-title">🎬 Cartelera</h1>
        <p className="page-subtitle">Descubre las mejores películas en nuestras salas</p>

        <div className="filters-bar">
          <div className="search-input-wrapper">
            <MdSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar película por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <div className="genre-filters" style={{ marginBottom: 32 }}>
          {GENEROS.map((genero) => (
            <button
              key={genero}
              className={`genre-chip ${generoActivo === genero ? 'active' : ''}`}
              onClick={() => setGeneroActivo(genero)}
            >
              {genero}
            </button>
          ))}
        </div>

        {cargando ? (
          <div className="loading-container">
            <div className="spinner" />
            <span className="loading-text">Cargando cartelera...</span>
          </div>
        ) : peliculas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎞️</div>
            <h3>No se encontraron películas</h3>
            <p>Intenta con otro término de búsqueda o género</p>
          </div>
        ) : (
          <div className="movies-grid">
            {peliculas.map((pelicula) => (
              <Link to={`/pelicula/${pelicula.id}`} key={pelicula.id}>
                <div className="card movie-card">
                  <div className="movie-poster">
                    {pelicula.imagenUrl ? (
                      <img src={`${API_URL}${pelicula.imagenUrl}`} alt={pelicula.titulo} />
                    ) : (
                      <div className="poster-placeholder">
                        <MdMovie />
                      </div>
                    )}
                    <div className="poster-overlay">
                      <span className="btn btn-primary btn-sm">Ver detalles</span>
                    </div>
                  </div>
                  <div className="movie-info">
                    <h3 className="movie-title">{pelicula.titulo}</h3>
                    <div className="movie-meta">
                      <span className="badge badge-genre">{pelicula.genero}</span>
                      <span className="badge badge-rating">{pelicula.clasificacion}</span>
                      <span className="badge badge-duration">
                        <MdAccessTime style={{ fontSize: '0.8rem' }} />
                        {pelicula.duracionMinutos} min
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
