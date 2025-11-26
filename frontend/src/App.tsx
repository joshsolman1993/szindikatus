
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
import { PlayerMarketPage } from './pages/PlayerMarketPage';
import { ClansPage } from './pages/ClansPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { CasinoPage } from './pages/CasinoPage';
import { PropertiesPage } from './pages/PropertiesPage';
import TalentsPage from './pages/TalentsPage';
import { CityMapPage } from './pages/CityMap';
import { MissionsPage } from './pages/MissionsPage';
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
            <Route path="/player-market" element={<PlayerMarketPage />} />
            <Route path="/clans" element={<ClansPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/casino" element={<CasinoPage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/talents" element={<TalentsPage />} />
            <Route path="/map" element={<CityMapPage />} />
            <Route path="/missions" element={<MissionsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
