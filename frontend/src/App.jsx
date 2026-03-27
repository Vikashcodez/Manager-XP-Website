import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import Home from './Pages/Home'
import Products from './Pages/Products'
import About from './Pages/About'
import Contact from './Pages/Contact'
import BookDemoPage from './Pages/BookDemo'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import AdminDashboard from './Pages/AdminDashboard'
import UserDashboard from './Pages/UserDashboard'
import CafeManager from './components/cafeManager'

const AppLayout = () => {
  const location = useLocation()
  const hideNavAndFooter = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/admin'
  const isDashboardRoute = location.pathname === '/dashboard'
  const hideFooter = hideNavAndFooter || isDashboardRoute

  return (
    <div className={`flex flex-col min-h-screen ${isDashboardRoute ? 'bg-black' : 'bg-white'}`}>
      {!hideNavAndFooter && <Navbar />}
      <main className={`flex-grow ${hideNavAndFooter ? '' : 'mt-16'} ${isDashboardRoute ? 'bg-black' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/demo" element={<BookDemoPage/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/add-cafe"
            element={(
              <ProtectedRoute>
                <CafeManager />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/admin"
            element={(
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            )}
          />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  )
}

export default App