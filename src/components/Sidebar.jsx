import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, LayoutDashboard, BarChart2 } from 'lucide-react'
import logoHMS from '../assets/logohms.png'

const ITEMS_SUPERVISOR = [
  { icon: Home,            label: 'Inicio',       path: '/supervisor/inicio' },
  { icon: LayoutDashboard, label: 'Dashboard',    path: '/supervisor/dashboard' },
  { icon: BarChart2,       label: 'Estadísticas', path: '/supervisor/graficos' },
]

const ITEMS_TERRENO = [
  { icon: Home,            label: 'Inicio',       path: '/terreno/inicio' },
  { icon: LayoutDashboard, label: 'Dashboard',    path: '/terreno/dashboard' },
  { icon: BarChart2,       label: 'Estadísticas', path: '/terreno/estadisticas' },
]

function Sidebar() {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Mostramos las rutas según el rol (terreno o supervisor) según la URL actual
  const ITEMS = location.pathname.startsWith('/terreno') ? ITEMS_TERRENO : ITEMS_SUPERVISOR

  return (
    <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        width: expanded ? '188px' : '58px',
        background: '#ffffff',
        zIndex: 50,
        transition: 'width 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--borde)',
        boxShadow: '4px 0 20px rgba(20,45,99,0.06)',
      }}
    >
      <div style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid var(--borde)',
        flexShrink: 0,
      }}>
        <div style={{
          width: '58px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <img
            src={logoHMS}
            alt="Hospital Militar de Santiago"
            style={{ height: '42px', width: 'auto', flexShrink: 0 }}
          />
        </div>
      </div>

      <div style={{ paddingTop: '8px' }}>
        {ITEMS.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '22px',
                width: '100%',
                padding: '14px 18px',
                background: active ? 'var(--primary-soft)' : 'transparent',
                border: 'none',
                borderLeft: `3px solid ${active ? 'var(--primary)' : 'transparent'}`,
                color: active ? 'var(--primary-dark)' : 'var(--text-suave)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                textAlign: 'left',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              <span style={{
                fontSize: '13px',
                fontWeight: active ? '600' : '400',
                opacity: expanded ? 1 : 0,
                transition: expanded ? 'opacity 0.18s ease 0.2s' : 'opacity 0.08s ease',
              }}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Sidebar
