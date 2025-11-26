import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Target, LogOut, Heart, Zap, Shield, Dumbbell, Users, ShoppingBag, Package, Trophy, Dices, Building, Brain, Map, ClipboardList, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ResourceBar } from './ResourceBar';
import { Button } from '../ui/Button';
import { ChatWidget } from '../layout/ChatWidget';

interface DashboardLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { path: '/dashboard', icon: Home, label: 'Főoldal' },
        { path: '/crimes', icon: Target, label: 'Bűntények' },
        { path: '/gym', icon: Dumbbell, label: 'Konditerem' },
        { path: '/streets', icon: Users, label: 'Az Utca' },
        { path: '/market', icon: ShoppingBag, label: 'Feketepiac' },
        { path: '/inventory', icon: Package, label: 'Leltár' },
        { path: '/clans', icon: Shield, label: 'Bandák' },
        { path: '/map', icon: Map, label: 'Térkép' },
        { path: '/missions', icon: ClipboardList, label: 'Küldetések' },
        { path: '/leaderboard', icon: Trophy, label: 'Ranglista' },
        { path: '/casino', icon: Dices, label: 'Kaszinó' },
        { path: '/properties', icon: Building, label: 'Ingatlanok' },
        { path: '/talents', icon: Brain, label: 'Tehetségek' },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Topbar */}
            <div className="border-b border-gray-800 bg-surface/50 backdrop-blur-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="md:hidden"
                                onClick={() => setIsMobileMenuOpen(true)}
                            >
                                <Menu className="w-6 h-6" />
                            </Button>
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
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-full 
                                        transition-all duration-300 relative overflow-hidden
                                        ${isActive
                                            ? 'bg-primary/20 text-white border-l-4 border-primary shadow-lg shadow-primary/30'
                                            : 'text-gray-400 hover:bg-gray-800/50 hover:text-white hover:border-l-4 hover:border-primary/50'
                                        }
                                    `}
                                >
                                    {isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
                                    )}
                                    <item.icon className="w-5 h-5 relative z-10" />
                                    <span className="font-medium relative z-10">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Drawer */}
                        <aside className="absolute left-0 top-0 bottom-0 w-[80%] bg-surface border-r border-gray-800 p-4 animate-slide-in-left glass-panel">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-display font-bold neon-text">MENÜ</h2>
                                <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                            <nav className="space-y-2">
                                {navItems.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`
                                                flex items-center gap-3 px-4 py-3 rounded-full 
                                                transition-all duration-300 relative overflow-hidden
                                                ${isActive
                                                    ? 'bg-primary/20 text-white border-l-4 border-primary shadow-lg shadow-primary/30'
                                                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-white hover:border-l-4 hover:border-primary/50'
                                                }
                                            `}
                                        >
                                            {isActive && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
                                            )}
                                            <item.icon className="w-5 h-5 relative z-10" />
                                            <span className="font-medium relative z-10">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </aside>
                    </div>
                )}

                {/* Main Content */}
                <main
                    className="flex-1 p-6 overflow-auto relative"
                    style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(15, 17, 21, 0.85), rgba(15, 17, 21, 0.95)), url('https://images.unsplash.com/photo-1605218427306-6354db69e563?q=80&w=2000&auto=format&fit=crop')`,
                        backgroundSize: 'cover',
                        backgroundAttachment: 'fixed',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="max-w-7xl mx-auto relative z-10">
                        {children}
                    </div>
                </main>
            </div>
            <ChatWidget />
        </div>
    );
};

export default DashboardLayout;
