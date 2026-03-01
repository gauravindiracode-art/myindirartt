import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './components/auth/LoginPage';
import LoadingSpinner from './components/common/LoadingSpinner';
import HomePage from './pages/HomePage';
import PostsPage from './pages/PostsPage';
import PostDetailPage from './pages/PostDetailPage';
import PoliciesPage from './pages/PoliciesPage';
import AcademicsPage from './pages/AcademicsPage';
import AdminPage from './pages/AdminPage';
import AcknowledgmentsPage from './pages/AcknowledgmentsPage';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner text="Starting Indira University..." />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/policies" element={<PoliciesPage />} />
        <Route
          path="/acknowledgments"
          element={
            user.role !== 'admin' ? <AcknowledgmentsPage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/academics"
          element={
            user.role === 'student' ? <AcademicsPage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/admin"
          element={
            user.role === 'admin' ? <AdminPage /> : <Navigate to="/" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
