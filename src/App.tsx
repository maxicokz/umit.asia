import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

// Lazy load pages for better bundle splitting
const HomePage = lazy(() => import('./pages/HomePage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const RequestsPage = lazy(() => import('./pages/RequestsPage'))
const RequestDetailPage = lazy(() => import('./pages/RequestDetailPage'))
const CreateRequestPage = lazy(() => import('./pages/CreateRequestPage'))
const EditRequestPage = lazy(() => import('./pages/EditRequestPage'))
const CreateOfferPage = lazy(() => import('./pages/CreateOfferPage'))
const OfferDetailPage = lazy(() => import('./pages/OfferDetailPage'))
const EditOfferPage = lazy(() => import('./pages/EditOfferPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const SheltersPage = lazy(() => import('./pages/SheltersPage'))
const VolunteersPage = lazy(() => import('./pages/VolunteersPage'))
const MapPage = lazy(() => import('./pages/MapPage'))
const RegistryPage = lazy(() => import('./pages/RegistryPage'))
const SecretSantaPage = lazy(() => import('./pages/SecretSantaPage'))
const WishTreePage = lazy(() => import('./pages/WishTreePage'))
const BeneficiaryDashboard = lazy(() => import('./pages/BeneficiaryDashboard'))
const DonorDashboard = lazy(() => import('./pages/DonorDashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="requests/:id" element={<RequestDetailPage />} />
          <Route
            path="requests/:id/edit"
            element={
              <ProtectedRoute requireRoles={['beneficiary', 'shelter', 'ngo', 'admin']}>
                <EditRequestPage />
              </ProtectedRoute>
            }
          />
          <Route path="registry" element={<RegistryPage />} />
          <Route path="offers/:id" element={<OfferDetailPage />} />
          <Route
            path="offers/:id/edit"
            element={
              <ProtectedRoute requireRoles={['donor', 'shelter', 'ngo', 'admin']}>
                <EditOfferPage />
              </ProtectedRoute>
            }
          />
          <Route path="shelters" element={<SheltersPage />} />
          <Route path="volunteers" element={<VolunteersPage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="secret-santa" element={<SecretSantaPage />} />
          <Route path="wish-tree" element={<WishTreePage />} />

          {/* Role-based protected routes */}
          <Route
            path="create-request"
            element={
              <ProtectedRoute requireRoles={['beneficiary', 'shelter', 'ngo', 'admin']}>
                <CreateRequestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="create-offer"
            element={
              <ProtectedRoute requireRoles={['donor', 'shelter', 'ngo', 'admin']}>
                <CreateOfferPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Dashboard routes */}
          <Route
            path="dashboard/beneficiary"
            element={
              <ProtectedRoute requireRoles={['beneficiary', 'shelter', 'ngo', 'admin']}>
                <BeneficiaryDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard/donor"
            element={
              <ProtectedRoute requireRoles={['donor', 'shelter', 'ngo', 'admin']}>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard/admin"
            element={
              <ProtectedRoute requireRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
