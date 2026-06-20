import api from './api';

export const autenticacionServicio = {
  registro: (datos) => api.post('/autenticacion/registro', datos),
  login: (datos) => api.post('/autenticacion/login', datos),
};

export const peliculasServicio = {
  listarTodas: (busqueda, genero) => {
    const params = {};
    if (busqueda) params.busqueda = busqueda;
    if (genero) params.genero = genero;
    return api.get('/peliculas', { params });
  },
  obtenerPorId: (id) => api.get(`/peliculas/${id}`),
  crear: (formData) => api.post('/peliculas', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  actualizar: (id, formData) => api.patch(`/peliculas/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  eliminar: (id) => api.delete(`/peliculas/${id}`),
};

export const salasServicio = {
  listarTodas: () => api.get('/salas'),
  obtenerPorId: (id) => api.get(`/salas/${id}`),
  crear: (datos) => api.post('/salas', datos),
  actualizar: (id, datos) => api.patch(`/salas/${id}`, datos),
  eliminar: (id) => api.delete(`/salas/${id}`),
};

export const funcionesServicio = {
  listarTodas: () => api.get('/funciones'),
  obtenerPorId: (id) => api.get(`/funciones/${id}`),
  crear: (datos) => api.post('/funciones', datos),
  actualizar: (id, datos) => api.patch(`/funciones/${id}`, datos),
  eliminar: (id) => api.delete(`/funciones/${id}`),
};

export const reservasServicio = {
  crear: (datos) => api.post('/reservas', datos),
  misReservas: () => api.get('/reservas/mis-reservas'),
  mapaAsientos: (funcionId) => api.get(`/reservas/funcion/${funcionId}/asientos`),
};
