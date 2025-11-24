
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { CrimesPage } from './pages/CrimesPage';
import { GymPage } from './pages/GymPage';
import { TheStreetsPage } from './pages/TheStreetsPage';
import { BlackMarketPage } from './pages/BlackMarketPage';
import { InventoryPage } from './pages/InventoryPage';
import { ClansPage } from './pages/ClansPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/crimes" element={<CrimesPage />} />
            <Route path="/gym" element={<GymPage />} />
            <Route path="/streets" element={<TheStreetsPage />} />
            <Route path="/market" element={<BlackMarketPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/clans" element={<ClansPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
