// Dashboard del personal en terreno
// Mantiene la capacidad de registrar: muestra los formularios disponibles
import { useNavigate } from 'react-router-dom'
import { Rat, Bug, BugPlay, Bird, SprayCan, ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import Sidebar from '../../components/Sidebar'
import '../../index.css'

// Lista de formularios disponibles para el personal en terreno
const FORMULARIOS = [
  { titulo: 'Control de Roedores', descripcion: 'Registro de estaciones de cebado', ruta: '/terreno/roedores', color: '#e74c3c', icono: Rat },
  { titulo: 'Control de Baratas', descripcion: 'Registro de aplicacion de cebo gel', ruta: '/terreno/baratas', color: '#e67e22', icono: Bug },
  { titulo: 'Control de Moscas', descripcion: 'Registro de aplicacion de cebo insecticida', ruta: '/terreno/moscas', color: '#f39c12', icono: BugPlay },
  { titulo: 'Control de Palomas', descripcion: 'Registro de capturas en trampa jaula', ruta: '/terreno/palomas', color: '#3498db', icono: Bird },
  { titulo: 'Desinfeccion', descripcion: 'Registro de desinfeccion y desinsectacion', ruta: '/terreno/desinfeccion', color: '#2ecc71', icono: SprayCan },
]

function Dashboard() {
  const navigate = useNavigate()

  // Función para cerrar sesión
  const cerrarSesion = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: '58px' }}>
        {/* Barra de navegación */}
        <nav className="navbar">
          <div>
            <p className="navbar-title">Control de Plagas HMS</p>
            <p className="navbar-subtitle">Personal en Terreno</p>
          </div>
          <button className="logout-btn" onClick={cerrarSesion}>
            Cerrar sesion
          </button>
        </nav>

        <div className="content">
          {/* Banner de bienvenida */}
          <div className="reg-hero">
            <h2>Bienvenido</h2>
            <p>¿Qué actividad deseas registrar hoy?</p>
          </div>

          {/* Tarjetas de formularios disponibles */}
          <div className="reg-grid">
            {FORMULARIOS.map((f) => {
              const Icono = f.icono
              return (
                <div
                  key={f.ruta}
                  className="reg-card"
                  style={{
                    '--acento': f.color,
                    '--acento-soft': `${f.color}1a`,
                  }}
                  onClick={() => navigate(f.ruta)}
                >
                  <div className="reg-icon">
                    <Icono size={26} strokeWidth={2} />
                  </div>
                  <p className="reg-titulo">{f.titulo}</p>
                  <p className="reg-desc">{f.descripcion}</p>
                  <p className="reg-cta">
                    Registrar <ArrowRight size={16} />
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
