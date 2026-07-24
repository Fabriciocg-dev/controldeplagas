// Importamos React y el hook useState para manejar el formulario
import { useState } from 'react'

// Importamos el cliente de Supabase
import { supabase } from '../lib/supabase'

// Importamos useNavigate para redirigir según el rol y useLocation para leer mensajes
import { useNavigate, useLocation } from 'react-router-dom'

// Imagen de fondo del hospital
import hospitalBg from '../assets/HOSPITAL.jpg'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  // Mensaje de éxito si el usuario acaba de crear su contraseña
  const passwordCreada = location.state?.passwordCreada

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)

    // Intentamos iniciar sesión con Supabase
    const { data, error: errorLogin } = await supabase.auth.signInWithPassword({ email, password })

    if (errorLogin) {
      setError('Credenciales incorrectas. Intenta de nuevo.')
      setCargando(false)
      return
    }

    // Consultamos el perfil del usuario para obtener su rol
    const { data: perfil, error: errorPerfil } = await supabase
      .from('perfiles')
      .select('rol')
      .eq('id', data.user.id)
      .single()

    if (errorPerfil || !perfil) {
      setError('No se encontro el perfil del usuario. Contacta al administrador.')
      setCargando(false)
      return
    }

    // Redirigimos según el rol del usuario
    // administrador y supervisor van al dashboard
    // tecnico va a la pantalla de formularios en terreno
    if (perfil.rol === 'supervisor' || perfil.rol === 'administrador' || perfil.rol === 'admin') {
      navigate('/supervisor/inicio')
    } else {
      navigate('/terreno/inicio')
    }

    setCargando(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Control de Plagas HMS</h1>
        <p style={styles.subtitle}>Hospital Militar de Santiago</p>

        {passwordCreada && (
          <p style={styles.exito}>
            Contraseña creada correctamente. Ya podés ingresar.
          </p>
        )}

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            style={styles.input}
            type="email"
            placeholder="Correo institucional"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Contrasena"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.button} type="submit" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: `linear-gradient(135deg, rgba(20,45,99,0.55) 0%, rgba(37,99,235,0.32) 100%), url(${hospitalBg}) center / cover no-repeat`,
    backgroundAttachment: 'fixed',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '360px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    textAlign: 'center',
  },
  title: {
    fontSize: '20px',
    color: 'var(--primary)',
    marginBottom: '4px',
  },
  subtitle: {
    color: '#666',
    fontSize: '13px',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  button: {
    padding: '12px',
    backgroundColor: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    cursor: 'pointer',
    marginTop: '8px',
  },
  error: {
    color: '#dc2626',
    fontSize: '13px',
  },
  exito: {
    color: '#155724',
    backgroundColor: '#d4edda',
    border: '1px solid #c3e6cb',
    borderRadius: '8px',
    padding: '10px',
    fontSize: '13px',
    marginBottom: '16px',
  },
}

export default Login