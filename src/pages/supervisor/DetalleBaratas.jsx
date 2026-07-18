import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { formatHoraChilena } from '../../lib/dateUtils'
import '../../index.css'

const coloresTratamiento = {
  'Cebo gel insecticida': '#e67e22',
  'Pulverizacion': '#9b59b6',
  'Cebo gel + Pulverizacion': '#e74c3c',
}

function DetalleBaratas() {
  const [registros, setRegistros] = useState([])
  const [cargando, setCargando] = useState(true)
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    cargarRegistros()
  }, [])

  const cargarRegistros = async () => {
    setCargando(true)
    let query = supabase.from('control_baratas').select('*').order('fecha', { ascending: false })
    if (fechaDesde) query = query.gte('fecha', fechaDesde)
    if (fechaHasta) query = query.lte('fecha', fechaHasta)
    const { data } = await query
    setRegistros(data || [])
    setCargando(false)
  }

  const limpiarFiltro = () => {
    setFechaDesde('')
    setFechaHasta('')
  }

  useEffect(() => {
    if (!fechaDesde && !fechaHasta) cargarRegistros()
  }, [fechaDesde, fechaHasta])

  if (cargando) {
    return <div className="loading"><p>Cargando registros...</p></div>
  }

  const formatFecha = (f) => f ? f.split('-').reverse().join('-') : '—'

  return (
    <div>
      <nav className="navbar no-print">
        <div>
          <p className="navbar-title">Control de Baratas</p>
          <p className="navbar-subtitle">Historial completo de registros</p>
        </div>
        <button className="logout-btn" onClick={() => navigate('/supervisor/dashboard')}>Volver</button>
      </nav>

      <div className="solo-print" style={styles.printHeader}>
        <div style={styles.printHeaderTop}>
          <div>
            <p style={{ fontWeight: 'bold', fontSize: '13px' }}>EJÉRCITO DE CHILE</p>
            <p style={{ fontSize: '12px' }}>DIVISIÓN DE SALUD — Hospital Militar de Santiago</p>
            <p style={{ fontSize: '12px' }}>DEPTO. PRSPV — SECC. SALUD PÚBLICA VETERINARIA</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '11px', color: '#555' }}>
            <p>Anexo: 6748 - 7241</p>
            <p>Generado: {new Date().toLocaleDateString('es-CL')}</p>
          </div>
        </div>
        <p style={styles.printTitulo}>REGISTRO DE CONTROL DE BARATAS</p>
        <p style={styles.printPeriodo}>
          Período: {fechaDesde ? formatFecha(fechaDesde) : 'Inicio'} — {fechaHasta ? formatFecha(fechaHasta) : 'Hoy'}
          {' · '}Total registros: {registros.length}
        </p>
      </div>

      <div className="content">
        <p className="section-title no-print">Registros de Control de Baratas</p>

        <div className="no-print filtros-bar" style={styles.filtros}>
          <span style={styles.filtroLabel}>Filtrar por fecha:</span>
          <div style={styles.filtroGrupo}>
            <label style={styles.filtroTexto}>Desde</label>
            <input type="date" style={styles.filtroInput} value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} />
          </div>
          <div style={styles.filtroGrupo}>
            <label style={styles.filtroTexto}>Hasta</label>
            <input type="date" style={styles.filtroInput} value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} />
          </div>
          <button style={styles.btnFiltrar} onClick={cargarRegistros}>Filtrar</button>
          <button style={styles.btnLimpiar} onClick={limpiarFiltro}>Limpiar</button>
          <button style={styles.btnImprimir} onClick={() => window.print()}>Imprimir PDF</button>
        </div>

        <div className="tabla-reciente">
          <div className="fila-reciente" style={styles.encabezado}>
            <span style={styles.col}>Fecha</span>
            <span style={styles.col}>Dependencia</span>
            <span style={styles.colGrande}>Tratamiento</span>
            <span style={styles.colGrande}>Observaciones</span>
            <span style={styles.colHora}>Hora Reg.</span>
          </div>

          {registros.length === 0 ? (
            <p className="sin-registros">Sin registros para el período seleccionado</p>
          ) : (
            registros.map((r) => (
              <div key={r.id} className="fila-reciente">
                <span style={styles.col}>{formatFecha(r.fecha)}</span>
                <span style={styles.col}>{r.dependencia || '—'}</span>
                <span style={styles.colGrande}>
                  <span style={{ ...styles.badge, backgroundColor: coloresTratamiento[r.tratamiento] || '#aaa' }}>
                    {r.tratamiento || '—'}
                  </span>
                </span>
                <span style={styles.colGrande}>{r.observaciones || '—'}</span>
                <span style={styles.colHora}>{formatHoraChilena(r.hora_registro)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  encabezado: { backgroundColor: 'var(--primary)', color: 'white', fontWeight: 'bold', fontSize: '13px' },
  col: { flex: 1, minWidth: '90px' },
  colGrande: { flex: 2, minWidth: '120px' },
  colHora: { flex: '0 0 110px' },
  badge: { color: 'white', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
  filtros: {
    display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
    backgroundColor: 'white', borderRadius: '10px', padding: '14px 20px',
    marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  filtroLabel: { fontSize: '13px', fontWeight: 'bold', color: 'var(--primary)', marginRight: '4px' },
  filtroGrupo: { display: 'flex', alignItems: 'center', gap: '6px' },
  filtroTexto: { fontSize: '12px', color: '#666' },
  filtroInput: { padding: '7px 10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '13px' },
  btnFiltrar: { padding: '7px 16px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
  btnLimpiar: { padding: '7px 16px', backgroundColor: '#aaa', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
  btnImprimir: { padding: '7px 16px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', marginLeft: 'auto' },
  printHeader: { padding: '16px 24px 8px', borderBottom: '2px solid var(--primary)', marginBottom: '12px' },
  printHeaderTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  printTitulo: { fontSize: '15px', fontWeight: 'bold', textAlign: 'center', marginBottom: '4px' },
  printPeriodo: { fontSize: '12px', textAlign: 'center', color: '#555' },
}

export default DetalleBaratas
