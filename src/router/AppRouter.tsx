import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProfilePage } from '../pages/ProfilePage';
import { VerifyEmailPage } from '../pages/VerifyEmailPage';
import { BerandaPage } from '../pages/BerandaPage';
import { RiwayatPage } from '../pages/RiwayatPage';
import { LaporPage } from '../pages/LaporPage';
import { LaporanDetailPage } from '../pages/LaporanDetailPage';
import { EditLaporanPage } from '../pages/EditLaporanPage';
import { LaporanSayaPage } from '../pages/LaporanSayaPage';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <BerandaPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/riwayat"
        element={
          <ProtectedRoute>
            <RiwayatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lapor"
        element={
          <ProtectedRoute>
            <LaporPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/laporan/:id"
        element={
          <ProtectedRoute>
            <LaporanDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/laporan-saya"
        element={
          <ProtectedRoute>
            <LaporanSayaPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/laporan/:id/edit"
        element={
          <ProtectedRoute>
            <EditLaporanPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
