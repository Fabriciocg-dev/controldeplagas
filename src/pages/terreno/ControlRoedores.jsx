// Formulario de Control de Roedores según Anexo N°1 y N°2 del protocolo DPRHA/07
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'

// Opciones de estado del cebo según el protocolo oficial
const ESTADOS_CEBO = [
  { valor: 'NC', label: 'NC — Cebo no comido' },
  { valor: 'CC', label: 'CC — Cebo comido' },
  { valor: 'MC', label: 'MC — Cebo muy comido' },
  { valor: 'TP', label: 'TP — Tiempo prolongado' },
  { valor: 'CE', label: 'CE — Cebo extraviado' },
]

function ControlRoedores() {
  // Estado del formulario con todos los campos de la tabla
  const [form, setForm] = useState({
    fecha: new Date().toLocaleDateString('en-CA'),
    numero_trampa: '',
    estado_cebo: '',
    recambio_cebo: false,
    nombre_producto: '',
    observaciones: '',
  })

  // Estado para mensajes de éxito o error
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })

  // Estado para saber si se está guardando
  const [guardando, setGuardando] = useState(false)

  const navigate = useNavigate()

  // Actualizamos el campo correspondiente cuando el usuario escribe o selecciona
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  // Enviamos el formulario a Supabase
  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setMensaje({ tipo: '', texto: '' })

    // Obtenemos el usuario actual para guardar quien registró
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('control_roedores').insert({
      fecha: form.fecha,
      numero_trampa: form.numero_trampa,
      estado_cebo: form.estado_cebo,
      recambio_cebo: form.recambio_cebo,
      nombre_producto: form.recambio_cebo ? form.nombre_producto : null,
      observaciones: form.observaciones,
      usuario_id: user?.id,
      hora_registro: new Date().toISOString(),
    })

    if (error) {
      setMensaje({ tipo: 'error', texto: 'Error al guardar el registro. Intenta de nuevo.' })
    } else {
      setMensaje({ tipo: 'exito', texto: 'Registro guardado correctamente.' })
      // Limpiamos el formulario manteniendo la fecha actual
      setForm({
        fecha: new Date().toLocaleDateString('en-CA'),
        numero_trampa: '',
        estado_cebo: '',
        recambio_cebo: false,
        nombre_producto: '',
        observaciones: '',
      })
    }

    setGuardando(false)
  }

  return (
    <div>
      {/* Barra de navegación */}
      <nav className="navbar">
        <div>
          <p className="navbar-title">Control de Roedores</p>
          <p className="navbar-subtitle">Anexo N°1 y N°2 — DPRHA/07</p>
        </div>
        <button className="logout-btn" onClick={() => navigate(-1)}>
          Volver
        </button>
      </nav>

      {/* Formulario */}
      <div className="content">
        <p className="section-title">Nuevo Registro de Control</p>

        <form onSubmit={handleSubmit} style={styles.form} className="form-terreno">

          {/* Fecha */}
          <div style={styles.campo}>
            <label style={styles.label}>Fecha de revision</label>
            <input
              style={styles.input}
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              required
            />
          </div>

          {/* Número de trampa */}
          <div style={styles.campo}>
            <label style={styles.label}>Numero de trampa</label>
            <input
              style={styles.input}
              type="text"
              name="numero_trampa"
              placeholder="Ej: T-01"
              value={form.numero_trampa}
              onChange={handleChange}
              required
            />
          </div>

          {/* Estado del cebo — opciones del protocolo oficial */}
          <div style={styles.campo}>
            <label style={styles.label}>Estado del cebo</label>
            <select
              style={styles.input}
              name="estado_cebo"
              value={form.estado_cebo}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione el estado</option>
              {ESTADOS_CEBO.map((e) => (
                <option key={e.valor} value={e.valor}>{e.label}</option>
              ))}
            </select>
          </div>

          {/* Recambio de cebo */}
          <div style={styles.campo}>
            <label style={styles.label}>Recambio de cebo</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <input
                type="checkbox"
                name="recambio_cebo"
                checked={form.recambio_cebo}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <span>Se realizó recambio de cebo</span>
            </label>
          </div>

          {/* Nombre del producto — solo si hubo recambio */}
          {form.recambio_cebo && (
            <div style={styles.campo}>
              <label style={styles.label}>Nombre del producto utilizado</label>
              <input
                style={styles.input}
                type="text"
                name="nombre_producto"
                placeholder="Ej: Klerat, Racumin, Storm..."
                value={form.nombre_producto}
                onChange={handleChange}
                required
              />
            </div>
          )}

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

          {/* Mensaje de éxito o error */}
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

          {/* Botón de guardar */}
          <button
            type="submit"
            style={styles.boton}
            disabled={guardando}
          >
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
    backgroundColor: 'var(--primary)',
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

export default ControlRoedores