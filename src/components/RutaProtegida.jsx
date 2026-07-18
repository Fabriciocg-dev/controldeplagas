// Este componente protege las rutas que requieren autenticación
// Si el usuario no está logueado, lo redirige al login
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function RutaProtegida({ children }) {
  // Estado para saber si hay un usuario autenticado
  const [usuario, setUsuario] = useState(null)
  
  // Estado para esperar mientras verificamos la sesión
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    // Verificamos si hay una sesión activa en Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUsuario(session?.user ?? null)
      setCargando(false)
    })
  }, [])

  // Mientras verificamos, mostramos una pantalla de carga
  if (cargando) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p>Verificando sesión...</p>
      </div>
    )
  }

  // Si no hay usuario, redirigimos al login
  if (!usuario) {
    return <Navigate to="/login" />
  }

  // Si hay usuario, mostramos la página solicitada
  return children
}

export default RutaProtegida