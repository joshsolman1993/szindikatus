import { Link, useLocation } from 'react-router-dom';
import { Home, Target, LogOut, Heart, Zap, Shield, Dumbbell, Users, ShoppingBag, Package, Trophy } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ResourceBar } from './ResourceBar';
import { Button } from '../ui/Button';
import { ChatWidget } from '../layout/ChatWidget';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', icon: Home, label: 'Főoldal' },
        { path: '/crimes', icon: Target, label: 'Bűntények' },
        { path: '/gym', icon: Dumbbell, label: 'Konditerem' },
        { path: '/streets', icon: Users, label: 'Az Utca' },
        { path: '/market', icon: ShoppingBag, label: 'Feketepiac' },
        { path: '/inventory', icon: Package, label: 'Leltár' },
        { path: '/clans', icon: Shield, label: 'Bandák' },
        { path: '/leaderboard', icon: Trophy, label: 'Ranglista' },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Topbar */}
            <div className="border-b border-gray-800 bg-surface/50 backdrop-blur-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-display font-bold neon-text">SZINDIKÁTUS</h1>
                            <span className="text-sm text-gray-400">Üdv, {user?.username}!</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={logout}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Kilépés
                        </Button>
                    </div>

                    {/* Resource Bars */}
                    <div className="flex flex-wrap gap-4">
                        <ResourceBar
                            label="HP"
                            current={user?.hp || 0}
                            max={user?.maxHp || 100}
                            color="success"
                            icon={<Heart className="w-4 h-4 text-success" />}
                        />
                        <ResourceBar
                            label="Energia"
                            current={user?.energy || 0}
                            max={user?.maxEnergy || 100}
                            color="secondary"
                            icon={<Zap className="w-4 h-4 text-secondary" />}
                        />
                        <ResourceBar
                            label="Bátorság"
                            current={user?.nerve || 0}
                            max={user?.maxNerve || 10}
                            color="primary"
                            icon={<Shield className="w-4 h-4 text-primary" />}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 border-r border-gray-800 bg-surface/30 p-4 hidden md:block">
                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-primary text-white'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
            <ChatWidget />
        </div>
    );
};
