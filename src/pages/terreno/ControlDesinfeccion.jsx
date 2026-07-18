import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'

function ControlDesinfeccion() {
  const [form, setForm] = useState({
    fecha: new Date().toLocaleDateString('en-CA'),
    dsf: false,
    dsn: false,
    dependencia: '',
    observaciones: '',
  })

  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })
  const [guardando, setGuardando] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.dsf && !form.dsn) {
      setMensaje({ tipo: 'error', texto: 'Debe seleccionar al menos un tratamiento (DSF o DSN).' })
      return
    }

    setGuardando(true)
    setMensaje({ tipo: '', texto: '' })

    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('desinfecciones').insert({
      fecha: form.fecha,
      dsf: form.dsf,
      dsn: form.dsn,
      dependencia: form.dependencia,
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
        dsf: false,
        dsn: false,
        dependencia: '',
        observaciones: '',
      })
    }

    setGuardando(false)
  }

  return (
    <div>
      <nav className="navbar">
        <div>
          <p className="navbar-title">Desinfeccion y Desinsectacion</p>
          <p className="navbar-subtitle">Depto. DPRSPV — Secc. Higiene Ambiental</p>
        </div>
        <button className="logout-btn" onClick={() => navigate(-1)}>
          Volver
        </button>
      </nav>

      <div className="content">
        <p className="section-title">Nuevo Registro</p>

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

          {/* Tratamientos */}
          <div style={styles.campo}>
            <label style={styles.label}>Tratamiento aplicado</label>
            <div style={styles.checkboxGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="dsf"
                  checked={form.dsf}
                  onChange={handleChange}
                  style={styles.checkbox}
                />
                <span>
                  <strong>DSF</strong> — Desinfeccion
                </span>
              </label>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="dsn"
                  checked={form.dsn}
                  onChange={handleChange}
                  style={styles.checkbox}
                />
                <span>
                  <strong>DSN</strong> — Desinsectacion
                </span>
              </label>
            </div>
          </div>

          {/* Dependencia */}
          <div style={styles.campo}>
            <label style={styles.label}>Dependencia / Area tratada</label>
            <input
              style={styles.input}
              type="text"
              name="dependencia"
              placeholder="Ej: Pabellon 3, Cocina, Urgencias..."
              value={form.dependencia}
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
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: 'var(--primary)',
  },
  boton: {
    padding: '12px',
    backgroundColor: '#2ecc71',
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

export default ControlDesinfeccion
