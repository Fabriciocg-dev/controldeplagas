// Página para que un usuario invitado cree su contraseña.
// Flujo: el usuario recibe el mail de invitación de Supabase, hace clic en el
// botón (que usa {{ .ConfirmationURL }} y redirige acá), Supabase valida el
// token y deja una sesión activa. Acá el usuario define su contraseña con
// supabase.auth.updateUser({ password }). Luego lo mandamos al login.
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import hospitalBg from '../assets/HOSPITAL.jpg'

function CrearPassword() {
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  // verificando: mientras chequeamos si el enlace trajo una sesión válida
  const [verificando, setVerificando] = useState(true)
  const [sesionValida, setSesionValida] = useState(false)

  const navigate = useNavigate()

  // Al abrir la página, establecemos la sesión a partir del token del enlace.
  useEffect(() => {
    let activo = true

    const verificar = async () => {
      // Método recomendado: el enlace trae token_hash + type en la URL,
      // y lo verificamos para crear la sesión.
      const params = new URLSearchParams(window.location.search)
      const token_hash = params.get('token_hash')
      const type = params.get('type')

      if (token_hash && type) {
        const { error: errorOtp } = await supabase.auth.verifyOtp({ token_hash, type })
        if (activo) {
          setSesionValida(!errorOtp)
          setVerificando(false)
        }
        return
      }

      // Alternativa: algunos enlaces traen el token en el hash (#access_token=...),
      // que supabase-js procesa solo. Verificamos si ya hay sesión.
      const { data: { session } } = await supabase.auth.getSession()
      if (activo) {
        setSesionValida(!!session)
        setVerificando(false)
      }
    }
    verificar()

    // Por si el token tarda un instante en procesarse, escuchamos el cambio
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evento, session) => {
      if (activo && session) {
        setSesionValida(true)
        setVerificando(false)
      }
    })

    return () => {
      activo = false
      subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validaciones básicas
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setGuardando(true)

    // Guardamos la nueva contraseña en el usuario logueado por el enlace
    const { error: errorUpdate } = await supabase.auth.updateUser({ password })

    if (errorUpdate) {
      setError('No se pudo crear la contraseña. El enlace puede haber expirado.')
      setGuardando(false)
      return
    }

    // Cerramos la sesión temporal del enlace y mandamos al login,
    // avisando que la contraseña quedó creada.
    await supabase.auth.signOut()
    navigate('/login', { state: { passwordCreada: true } })
  }

  // Mientras verificamos el enlace
  if (verificando) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={styles.subtitle}>Verificando enlace...</p>
        </div>
      </div>
    )
  }

  // Si el enlace no trajo una sesión válida (expirado o abierto directo)
  if (!sesionValida) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Enlace no válido</h1>
          <p style={styles.subtitle}>
            El enlace de invitación no es válido o ya expiró. Solicite al administrador
            que te envíe una nueva invitación.
          </p>
          <button style={styles.button} onClick={() => navigate('/login')}>
            Ir al inicio de sesión
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Crear tu contraseña</h1>
        <p style={styles.subtitle}>Define una contraseña para acceder al sistema.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Repite la contraseña"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.button} type="submit" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Crear contraseña'}
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
}

export default CrearPassword
