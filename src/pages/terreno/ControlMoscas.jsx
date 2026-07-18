import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'

function ControlMoscas() {
  const [form, setForm] = useState({
    fecha: new Date().toLocaleDateString('en-CA'),
    dependencia: '',
    cebo_utilizado: '',
    observaciones: '',
  })

  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })
  const [guardando, setGuardando] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setMensaje({ tipo: '', texto: '' })

    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('control_moscas').insert({
      fecha: form.fecha,
      dependencia: form.dependencia,
      cebo_utilizado: form.cebo_utilizado,
      observaciones: form.observaciones,
      usuario_id: user?.id,
      hora_registro: new Date().toISOString(),
    })

    if (error) {
      setMensaje({ tipo: 'error', texto: 'Error al guardar el registro. Intenta de nuevo.' })
    } else {
      setMensaje({ tipo: 'exito', texto: 'Registro guardado correctamente.' })
      setForm({
        fecha: new Date().toLocaleDateString('en-CA'),
        dependencia: '',
        cebo_utilizado: '',
        observaciones: '',
      })
    }

    setGuardando(false)
  }

  return (
    <div>
      <nav className="navbar">
        <div>
          <p className="navbar-title">Control de Moscas</p>
          <p className="navbar-subtitle">Seccion E — DPRHA/07</p>
        </div>
        <button className="logout-btn" onClick={() => navigate(-1)}>
          Volver
        </button>
      </nav>

      <div className="content">
        <p className="section-title">Nuevo Registro de Aplicacion</p>

        <form onSubmit={handleSubmit} style={styles.form} className="form-terreno">

          {/* Fecha */}
          <div style={styles.campo}>
            <label style={styles.label}>Fecha de aplicacion</label>
            <input
              style={styles.input}
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              required
            />
          </div>

          {/* Dependencia */}
          <div style={styles.campo}>
            <label style={styles.label}>Dependencia / Area tratada</label>
            <input
              style={styles.input}
              type="text"
              name="dependencia"
              placeholder="Ej: Marcos puertas acceso principal, Bodega residuos..."
              value={form.dependencia}
              onChange={handleChange}
              required
            />
          </div>

          {/* Cebo utilizado */}
          <div style={styles.campo}>
            <label style={styles.label}>Cebo insecticida utilizado</label>
            <input
              style={styles.input}
              type="text"
              name="cebo_utilizado"
              placeholder="Ej: Muscamone, QuickBayt, Imox..."
              value={form.cebo_utilizado}
              onChange={handleChange}
              required
            />
          </div>

          {/* Observaciones */}
          <div style={styles.campo}>
            <label style={styles.label}>Observaciones</label>
            <textarea
              style={{ ...styles.input, height: '90px', resize: 'vertical' }}
              name="observaciones"
              placeholder="Estado de la infestacion, numero de parches aplicados, seguimiento..."
              value={form.observaciones}
              onChange={handleChange}
            />
          </div>

          {mensaje.texto && (
            <div style={{
              ...styles.mensaje,
              backgroundColor: mensaje.tipo === 'exito' ? '#d4edda' : '#f8d7da',
              color: mensaje.tipo === 'exito' ? '#155724' : '#721c24',
              borderColor: mensaje.tipo === 'exito' ? '#c3e6cb' : '#f5c6cb',
            }}>
              {mensaje.texto}
            </div>
          )}

          <button type="submit" style={styles.boton} disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar Registro'}
          </button>

        </form>
      </div>
    </div>
  )
}

const styles = {
  form: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '600px',
  },
  campo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'var(--primary)',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    width: '100%',
    backgroundColor: 'white',
  },
  boton: {
    padding: '12px',
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    cursor: 'pointer',
    marginTop: '8px',
  },
  mensaje: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '13px',
  },
}

export default ControlMoscas
