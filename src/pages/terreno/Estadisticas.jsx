// Estadísticas del personal en terreno
// Misma estructura visual que las estadísticas del supervisor
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'
import {
  PieChart, Pie, Cell, Tooltip as PieTooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import Sidebar from '../../components/Sidebar'
import '../../index.css'

const CATEGORIAS = [
  { key: 'roedores',       tabla: 'control_roedores', label: 'Roedores',       color: '#e74c3c' },
  { key: 'baratas',        tabla: 'control_baratas',  label: 'Baratas',        color: '#e67e22' },
  { key: 'moscas',         tabla: 'control_moscas',   label: 'Moscas',         color: '#f39c12' },
  { key: 'palomas',        tabla: 'control_palomas',  label: 'Palomas',        color: '#3498db' },
  { key: 'desinfecciones', tabla: 'desinfecciones',   label: 'Desinfecciones', color: '#2ecc71' },
]

function getUltimos6Meses() {
  const meses = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - i)
    meses.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('es-CL', { month: 'short' }),
    })
  }
  return meses
}

function Estadisticas() {
  const [totales, setTotales]     = useState([])
  const [tendencia, setTendencia] = useState([])
  const [cargando, setCargando]   = useState(true)
  const navigate = useNavigate()

  useEffect(() => { cargarDatos() }, [])

  const cargarDatos = async () => {
    setCargando(true)
    const meses = getUltimos6Meses()
    const desde = meses[0].key + '-01'

    const resultados = await Promise.all(
      CATEGORIAS.map(c => Promise.all([
        supabase.from(c.tabla).select('*', { count: 'exact', head: true }),
        supabase.from(c.tabla).select('fecha').gte('fecha', desde),
      ]))
    )

    setTotales(
      CATEGORIAS.map((c, i) => ({ ...c, total: resultados[i][0].count || 0 }))
    )

    setTendencia(
      meses.map(m => {
        let total = 0
        CATEGORIAS.forEach((c, i) => {
          total += (resultados[i][1].data || []).filter(r => r.fecha?.startsWith(m.key)).length
        })
        return { mes: m.label, total }
      })
    )

    setCargando(false)
  }

  if (cargando) {
    return <div className="loading"><p>Cargando estadísticas...</p></div>
  }

  const maxTotal = Math.max(...totales.map(t => t.total), 1)
  const totalGeneral = totales.reduce((s, t) => s + t.total, 0)

  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: '58px' }}>
        <nav className="navbar">
          <div>
            <p className="navbar-title">Estadísticas</p>
            <p className="navbar-subtitle">Resumen visual por categoría</p>
          </div>
          <button className="logout-btn" onClick={() => navigate('/terreno/dashboard')}>
            Volver
          </button>
        </nav>

        <div className="content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Fila superior: barras + pie */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>

            {/* Barras por categoría */}
            <div style={styles.card}>
              <p style={styles.cardTitulo}>Registros por categoría</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {totales.map(cat => (
                  <div key={cat.key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color }} />
                        <span style={{ fontSize: '13px', color: '#333' }}>{cat.label}</span>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: cat.color }}>{cat.total}</span>
                    </div>
                    <div style={{ height: '5px', background: '#ebebeb', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${(cat.total / maxTotal) * 100}%`,
                        background: cat.color,
                        borderRadius: '10px',
                        transition: 'width 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pie chart */}
            <div style={styles.card}>
              <p style={styles.cardTitulo}>Distribución</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <PieChart width={160} height={160}>
                    <Pie
                      data={totales}
                      dataKey="total"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={72}
                      paddingAngle={2}
                      strokeWidth={0}
                    >
                      {totales.map((entry) => (
                        <Cell key={entry.key} fill={entry.color} />
                      ))}
                    </Pie>
                    <PieTooltip
                      formatter={(v, name) => [`${v} registros`, name]}
                      contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    pointerEvents: 'none',
                  }}>
                    <p style={{ fontSize: '20px', fontWeight: '800', color: '#111', lineHeight: 1 }}>{totalGeneral}</p>
                    <p style={{ fontSize: '10px', color: '#aaa', marginTop: '3px' }}>total</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', flex: 1 }}>
                  {totales.map(t => (
                    <div key={t.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '2px', background: t.color, flexShrink: 0 }} />
                        <span style={{ fontSize: '12px', color: '#555' }}>{t.label}</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#333' }}>
                        {totalGeneral > 0 ? Math.round((t.total / totalGeneral) * 100) : 0}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Línea de tendencia */}
          <div style={styles.card}>
            <p style={styles.cardTitulo}>Actividad — últimos 6 meses</p>
            <ResponsiveContainer width="100%" height={190}>
              <LineChart data={tendencia} margin={{ left: -18, right: 12, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#bbb' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#bbb' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v) => [`${v} registros`, 'Total']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  )
}

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '22px 24px',
    boxShadow: '0 2px 10px rgba(20,45,99,0.07)',
  },
  cardTitulo: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '18px',
  },
}

export default Estadisticas
