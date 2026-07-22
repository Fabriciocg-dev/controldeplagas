// Este componente protege las rutas que requieren autenticación.
// - Si el usuario no está logueado, lo redirige al login.
// - Si la ruta exige roles específicos y el usuario no los tiene,
//   lo redirige a su propia área según su rol.
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// Roles considerados de nivel supervisor (ven dashboards y detalles)
export const ROLES_SUPERVISOR = ['supervisor', 'administrador', 'admin']

// Devuelve la ruta de inicio que le corresponde a un rol
function inicioSegunRol(rol) {
  return ROLES_SUPERVISOR.includes(rol) ? '/supervisor/inicio' : '/terreno/inicio'
}

function RutaProtegida({ children, roles }) {
  // Estado unificado: mientras verificamos, el usuario y su rol
  const [estado, setEstado] = useState({ cargando: true, usuario: null, rol: null })

  useEffect(() => {
    // Evitamos actualizar el estado si el componente se desmontó
    let activo = true

    const verificar = async () => {
      // 1) ¿Hay sesión activa?
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        if (activo) setEstado({ cargando: false, usuario: null, rol: null })
        return
      }

      // 2) Consultamos el rol del usuario en la tabla de perfiles
      const { data: perfil } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('id', session.user.id)
        .single()

      if (activo) {
        setEstado({ cargando: false, usuario: session.user, rol: perfil?.rol ?? null })
      }
    }

    verificar()

    return () => { activo = false }
  }, [])

  // Mientras verificamos, mostramos una pantalla de carga
  if (estado.cargando) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p>Verificando sesión...</p>
      </div>
    )
  }

  // Si no hay usuario, redirigimos al login
  if (!estado.usuario) {
    return <Navigate to="/login" replace />
  }

  // Si la ruta exige roles y el usuario no los tiene,
  // lo mandamos a su propia área en vez de dejarlo ver contenido ajeno
  if (roles && !roles.includes(estado.rol)) {
    return <Navigate to={inicioSegunRol(estado.rol)} replace />
  }

  // Todo en orden: mostramos la página solicitada
  return children
}

export default RutaProtegida
