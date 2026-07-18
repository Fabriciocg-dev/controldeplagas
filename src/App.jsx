// Importamos las herramientas de navegación
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Importamos las páginas
import Login from './pages/Login'
import InicioSupervisor from './pages/supervisor/Inicio'
import Dashboard from './pages/supervisor/Dashboard'
import DetalleRoedores from './pages/supervisor/DetalleRoedores'
import DetalleDesinfecciones from './pages/supervisor/DetalleDesinfecciones'
import DetallePalomas from './pages/supervisor/DetallePalomas'
import DetalleBaratas from './pages/supervisor/DetalleBaratas'
import DetalleMoscas from './pages/supervisor/DetalleMoscas'
import Graficos from './pages/supervisor/Graficos'
import Inicio from './pages/terreno/Inicio'
import DashboardTerreno from './pages/terreno/Dashboard'
import EstadisticasTerreno from './pages/terreno/Estadisticas'
import ControlRoedores from './pages/terreno/ControlRoedores'
import ControlDesinfeccion from './pages/terreno/ControlDesinfeccion'
import ControlPalomas from './pages/terreno/ControlPalomas'
import ControlBaratas from './pages/terreno/ControlBaratas'
import ControlMoscas from './pages/terreno/ControlMoscas'

// Importamos el componente que protege las rutas
import RutaProtegida from './components/RutaProtegida'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal redirige al login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Ruta del login, publica */}
        <Route path="/login" element={<Login />} />

        {/* Rutas del supervisor, protegidas */}
        <Route path="/supervisor/inicio" element={<RutaProtegida><InicioSupervisor /></RutaProtegida>} />
        <Route path="/supervisor/dashboard" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
        <Route path="/supervisor/roedores" element={<RutaProtegida><DetalleRoedores /></RutaProtegida>} />
        <Route path="/supervisor/desinfecciones" element={<RutaProtegida><DetalleDesinfecciones /></RutaProtegida>} />
        <Route path="/supervisor/palomas" element={<RutaProtegida><DetallePalomas /></RutaProtegida>} />
        <Route path="/supervisor/baratas" element={<RutaProtegida><DetalleBaratas /></RutaProtegida>} />
        <Route path="/supervisor/moscas" element={<RutaProtegida><DetalleMoscas /></RutaProtegida>} />
        <Route path="/supervisor/graficos" element={<RutaProtegida><Graficos /></RutaProtegida>} />

        {/* Rutas del personal en terreno, protegidas */}
        <Route path="/terreno/inicio" element={<RutaProtegida><Inicio /></RutaProtegida>} />
        <Route path="/terreno/dashboard" element={<RutaProtegida><DashboardTerreno /></RutaProtegida>} />
        <Route path="/terreno/estadisticas" element={<RutaProtegida><EstadisticasTerreno /></RutaProtegida>} />
        <Route path="/terreno/roedores" element={<RutaProtegida><ControlRoedores /></RutaProtegida>} />
        <Route path="/terreno/desinfeccion" element={<RutaProtegida><ControlDesinfeccion /></RutaProtegida>} />
        <Route path="/terreno/palomas" element={<RutaProtegida><ControlPalomas /></RutaProtegida>} />
        <Route path="/terreno/baratas" element={<RutaProtegida><ControlBaratas /></RutaProtegida>} />
        <Route path="/terreno/moscas" element={<RutaProtegida><ControlMoscas /></RutaProtegida>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App