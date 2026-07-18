// Pantalla de inicio del personal en terreno
// Pantalla de bienvenida con carrusel (misma estructura que la del supervisor)
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import hospitalImg from '../../assets/HOSPITAL.jpg'
import '../../index.css'

// Imágenes del carrusel. Para agregar más, basta con sumar objetos aquí.
const SLIDES = [
  {
    img: hospitalImg,
    titulo: 'Hospital Militar de Santiago',
    texto: 'Bienvenido al sistema de Control de Plagas HMS.',
  },
]

function Inicio() {
  const [actual, setActual] = useState(0)
  const navigate = useNavigate()
  const total = SLIDES.length

  // Avance automático del carrusel (solo si hay más de una imagen)
  useEffect(() => {
    if (total <= 1) return
    const id = setInterval(() => setActual(a => (a + 1) % total), 5000)
    return () => clearInterval(id)
  }, [total])

  const cerrarSesion = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const ir = (i) => setActual((i + total) % total)

  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: '58px' }}>
        <nav className="navbar">
          <div>
            <p className="navbar-title">Inicio</p>
            <p className="navbar-subtitle">Personal en Terreno</p>
          </div>
          <button className="logout-btn" onClick={cerrarSesion}>
            Cerrar sesion
          </button>
        </nav>

        <div className="content">
          {/* Mensaje de bienvenida */}
          <div style={styles.bienvenida}>
            <h1 style={styles.marca}>Control de Plagas HMS</h1>
            <p style={styles.subtitulo}>Bienvenido al Sistema de Gestión y Monitoreo</p>
            <p style={styles.hospital}>Hospital Militar de Santiago</p>
            <p style={styles.lema}>
              “Comprometidos con mantener entornos seguros<br />
              y libres de riesgos sanitarios.”
            </p>
          </div>

          {/* Carrusel de imágenes */}
          <div style={styles.carrusel}>
            {SLIDES.map((s, i) => (
              <div
                key={i}
                style={{
                  ...styles.slide,
                  opacity: i === actual ? 1 : 0,
                  pointerEvents: i === actual ? 'auto' : 'none',
                }}
              >
                <img src={s.img} alt={s.titulo} style={styles.slideImg} />
                <div style={styles.slideOverlay} />
                <div style={styles.slideTexto}>
                  <p style={styles.slideTitulo}>{s.titulo}</p>
                  <p style={styles.slideSub}>{s.texto}</p>
                </div>
              </div>
            ))}

            {total > 1 && (
              <>
                <button style={{ ...styles.flecha, left: '14px' }} onClick={() => ir(actual - 1)} aria-label="Anterior">
                  <ChevronLeft size={22} />
                </button>
                <button style={{ ...styles.flecha, right: '14px' }} onClick={() => ir(actual + 1)} aria-label="Siguiente">
                  <ChevronRight size={22} />
                </button>
                <div style={styles.dots}>
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => ir(i)}
                      aria-label={`Imagen ${i + 1}`}
                      style={{
                        ...styles.dot,
                        background: i === actual ? 'white' : 'rgba(255,255,255,0.5)',
                        width: i === actual ? '22px' : '8px',
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  bienvenida: {
    textAlign: 'center',
    padding: '16px 0 8px',
  },
  marca: {
    fontSize: '30px',
    fontWeight: '800',
    color: 'var(--primary-dark)',
    letterSpacing: '0.5px',
  },
  subtitulo: {
    fontSize: '17px',
    fontWeight: '600',
    color: 'var(--primary)',
    marginTop: '8px',
  },
  hospital: {
    fontSize: '14px',
    color: 'var(--text-suave)',
    marginTop: '4px',
  },
  lema: {
    fontSize: '15px',
    fontStyle: 'italic',
    color: 'var(--text-suave)',
    marginTop: '16px',
    lineHeight: 1.6,
  },
  carrusel: {
    position: 'relative',
    width: '100%',
    height: '380px',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: 'var(--sombra)',
    marginTop: '24px',
  },
  slide: {
    position: 'absolute',
    inset: 0,
    transition: 'opacity 0.8s ease',
  },
  slideImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  slideOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, rgba(20,45,99,0.05) 0%, rgba(20,45,99,0.78) 100%)',
  },
  slideTexto: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: '28px 32px',
    color: 'white',
  },
  slideTitulo: {
    fontSize: '24px',
    fontWeight: '800',
    marginBottom: '6px',
    textShadow: '0 2px 8px rgba(0,0,0,0.4)',
  },
  slideSub: {
    fontSize: '15px',
    opacity: 0.95,
    textShadow: '0 1px 6px rgba(0,0,0,0.4)',
  },
  flecha: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: 'white',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  dots: {
    position: 'absolute',
    bottom: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
  },
  dot: {
    height: '8px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
}

export default Inicio
