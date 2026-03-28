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

const AppLayout = () => {
  const location = useLocation()
  const hideNavAndFooter = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/admin'

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {!hideNavAndFooter && <Navbar />}
      <main className={`flex-1 transition-all duration-300 ${hideNavAndFooter ? '' : 'lg:ml-64 lg:mt-20 mt-16'}`}> {/* Responsive margins: mobile gets mt-16, desktop gets ml-64 and mt-20 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/demo" element={<BookDemoPage/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
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
      {!hideNavAndFooter && <Footer />}
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
