import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'

function ControlPalomas() {
  const [form, setForm] = useState({
    fecha: new Date().toLocaleDateString('en-CA'),
    lugar: '',
    cantidad: '',
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

    const { error } = await supabase.from('control_palomas').insert({
      fecha: form.fecha,
      lugar: form.lugar,
      cantidad: parseInt(form.cantidad) || 0,
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
        lugar: '',
        cantidad: '',
        observaciones: '',
      })
    }

    setGuardando(false)
  }

  return (
    <div>
      <nav className="navbar">
        <div>
          <p className="navbar-title">Control de Palomas</p>
          <p className="navbar-subtitle">Anexo N°5 — DPRHA/07</p>
        </div>
        <button className="logout-btn" onClick={() => navigate(-1)}>
          Volver
        </button>
      </nav>

      <div className="content">
        <p className="section-title">Nuevo Registro de Captura</p>

        <form onSubmit={handleSubmit} style={styles.form} className="form-terreno">

          {/* Fecha */}
          <div style={styles.campo}>
            <label style={styles.label}>Fecha de captura</label>
            <input
              style={styles.input}
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              required
            />
          </div>

          {/* Lugar */}
          <div style={styles.campo}>
            <label style={styles.label}>Lugar</label>
            <input
              style={styles.input}
              type="text"
              name="lugar"
              placeholder="Ej: Techo Pabellon 3, Azotea Edificio D..."
              value={form.lugar}
              onChange={handleChange}
              required
            />
          </div>

          {/* Cantidad */}
          <div style={styles.campo}>
            <label style={styles.label}>Cantidad de aves capturadas</label>
            <input
              style={styles.input}
              type="number"
              name="cantidad"
              placeholder="0"
              min="0"
              value={form.cantidad}
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
              placeholder="Ingrese observaciones adicionales..."
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
    backgroundColor: '#3498db',
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

export default ControlPalomas
