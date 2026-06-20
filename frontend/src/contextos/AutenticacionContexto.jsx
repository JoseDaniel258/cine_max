import { createContext, useContext, useState, useEffect } from 'react';
import { autenticacionServicio } from '../servicios/servicios';

const AutenticacionContexto = createContext(null);

export function AutenticacionProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Restaurar sesión del localStorage
    const usuarioGuardado = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');
    if (usuarioGuardado && token) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
    setCargando(false);
  }, []);

  const login = async (email, contrasena) => {
    const { data } = await autenticacionServicio.login({ email, contrasena });
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    return data;
  };

  const registro = async (nombre, email, contrasena) => {
    const { data } = await autenticacionServicio.registro({ nombre, email, contrasena });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  const esAdmin = usuario?.rol === 'admin';
  const estaAutenticado = !!usuario;

  return (
    <AutenticacionContexto.Provider
      value={{ usuario, cargando, login, registro, logout, esAdmin, estaAutenticado }}
    >
      {children}
    </AutenticacionContexto.Provider>
  );
}

export function useAuth() {
  const context = useContext(AutenticacionContexto);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AutenticacionProvider');
  }
  return context;
}
