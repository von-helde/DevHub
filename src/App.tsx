import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProjectProvider } from './contexts/ProjectContext'
import { GlobalStyle } from './styles/GlobalStyle'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import EditProfile from './pages/EditProfile'
import Projects from './pages/Projects'
import Favorites from './pages/Favorites'
import Discover from './pages/Discover'
import PublicPortfolio from './pages/PublicPortfolio'

export default function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <GlobalStyle />
        <BrowserRouter>
          <Header />
          <main>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/portfolio/:userId" element={<PublicPortfolio />} />

              {/* Rotas protegidas */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id/edit" element={<Projects />} />
                <Route path="/favorites" element={<Favorites />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </ProjectProvider>
    </AuthProvider>
  )
};