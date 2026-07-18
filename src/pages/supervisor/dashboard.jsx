import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import '../../index.css'

function Dashboard() {
  const [conteos, setConteos] = useState({ roedores: 0, baratas: 0, moscas: 0, palomas: 0, desinfecciones: 0 })
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => { cargarDatos() }, [])

  const cargarDatos = async () => {
    setCargando(true)
    const [roedores, baratas, moscas, palomas, desinfecciones] = await Promise.all([
      supabase.from('control_roedores').select('*', { count: 'exact', head: true }),
      supabase.from('control_baratas').select('*', { count: 'exact', head: true }),
      supabase.from('control_moscas').select('*', { count: 'exact', head: true }),
      supabase.from('control_palomas').select('*', { count: 'exact', head: true }),
      supabase.from('desinfecciones').select('*', { count: 'exact', head: true }),
    ])
    setConteos({
      roedores: roedores.count || 0,
      baratas: baratas.count || 0,
      moscas: moscas.count || 0,
      palomas: palomas.count || 0,
      desinfecciones: desinfecciones.count || 0,
    })
    setCargando(false)
  }

  const cerrarSesion = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (cargando) {
    return <div className="loading"><p>Cargando datos...</p></div>
  }

  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: '58px' }}>
        <nav className="navbar">
          <div>
            <p className="navbar-title">Control de Plagas HMS</p>
            <p className="navbar-subtitle">Hospital Militar de Santiago</p>
          </div>
          <button className="logout-btn" onClick={cerrarSesion}>
            Cerrar sesion
          </button>
        </nav>

        <div className="content">
          <p className="section-title">Resumen General</p>
          <div className="cards-grid">
            <Tarjeta titulo="Roedores"       valor={conteos.roedores}       color="#e74c3c" onClick={() => navigate('/supervisor/roedores')} />
            <Tarjeta titulo="Baratas"        valor={conteos.baratas}        color="#e67e22" onClick={() => navigate('/supervisor/baratas')} />
            <Tarjeta titulo="Moscas"         valor={conteos.moscas}         color="#f39c12" onClick={() => navigate('/supervisor/moscas')} />
            <Tarjeta titulo="Palomas"        valor={conteos.palomas}        color="#3498db" onClick={() => navigate('/supervisor/palomas')} />
            <Tarjeta titulo="Desinfecciones" valor={conteos.desinfecciones} color="#2ecc71" onClick={() => navigate('/supervisor/desinfecciones')} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Tarjeta({ titulo, valor, color, onClick }) {
  return (
    <div className="card" style={{ borderTop: `4px solid ${color}`, cursor: 'pointer' }} onClick={onClick}>
      <p className="card-titulo">{titulo}</p>
      <p className="card-valor" style={{ color }}>{valor}</p>
      <p className="card-sub">Ver registros</p>
    </div>
  )
}

export default Dashboard
