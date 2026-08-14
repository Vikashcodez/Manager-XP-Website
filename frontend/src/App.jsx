<<<<<<< Updated upstream
import React, { useEffect } from 'react'
=======
import React, { useEffect, lazy, Suspense } from 'react'
>>>>>>> Stashed changes
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

// Signed-in surfaces are large and never needed by a first-time visitor, so they
// load on demand instead of shipping with the marketing bundle.
const AdminDashboard = lazy(() => import('./Pages/AdminDashboard'))
const UserDashboard = lazy(() => import('./Pages/UserDashboard'))
const CafeManager = lazy(() => import('./components/cafeManager'))
const GamerXpLogin = lazy(() => import('./Pages/GamingXplogin'))

const RouteFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center bg-black">
    <span className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-700 border-t-red-500" />
  </div>
)

// Router keeps the previous scroll offset across navigations; reset it so each
// page starts at the top.
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

// Router keeps the previous scroll offset across navigations; reset it so each
// page starts at the top.
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

const AppLayout = () => {
  const location = useLocation()
  const hideNavAndFooter = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/admin' || location.pathname === '/gamingxp-login'
  const isDashboardRoute = location.pathname === '/dashboard'
  const hideFooter = hideNavAndFooter || isDashboardRoute

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <ScrollToTop />
      {!hideNavAndFooter && <Navbar />}
      <main className={`flex-grow ${hideNavAndFooter ? '' : 'mt-16'}`}>
<<<<<<< Updated upstream
=======
        <Suspense fallback={<RouteFallback />}>
>>>>>>> Stashed changes
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/demo" element={<BookDemoPage/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/gamingxp-login" element={<GamerXpLogin />} />
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
        </Suspense>
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