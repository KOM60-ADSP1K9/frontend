import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './protected.route';
import { LoginPage } from '../pages/auth/login.page';
import { RegisterPage } from '../pages/auth/register.page';
import { ProfilePage } from '../pages/auth/profile.page';
import { VerifyEmailPage } from '../pages/auth/verify.email.page';
import { BerandaPage } from '../pages/student/home.page';
import { RiwayatPage } from '../pages/report/cari.laporan.page';
import { LaporPage } from '../pages/report/lapor.page';
import { LaporanDetailPage } from '../pages/report/laporan.detail.page';
import { EditLaporanPage } from '../pages/report/edit.laporan.page';
import { LaporanSayaPage } from '../pages/report/laporan.saya.page';
import { NotifikasiPage } from '../pages/notifikasi.page';
import { UsersPage } from '../pages/staff/users.page';

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
        path="/laporan"
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
      <Route
        path="/notifikasi"
        element={
          <ProtectedRoute>
            <NotifikasiPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/users"
        element={
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
