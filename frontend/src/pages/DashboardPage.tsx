import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { StatCard } from '../components/dashboard/StatCard';
import { Button } from '../components/ui/Button';
import { ToastContainer } from '../components/ui/Toast';
import { useToast } from '../hooks/useToast';
import { refillEnergy } from '../api/user';
import { DollarSign, Zap, Heart, Shield, Sparkles, Dumbbell, Target, TrendingUp, Activity } from 'lucide-react';

export const DashboardPage = () => {
    const { user, refreshProfile } = useAuth();
    const { toasts, addToast, removeToast } = useToast();
    const [isRefilling, setIsRefilling] = useState(false);

    useEffect(() => {
        refreshProfile();
    }, []);

    const handleRefillEnergy = async () => {
        setIsRefilling(true);
        try {
            await refillEnergy();
            await refreshProfile();
            addToast('Energia és HP feltöltve!', 'success');
        } catch (error) {
            addToast('Hiba történt a töltés során.', 'error');
        } finally {
            setIsRefilling(false);
        }
    };

    // Calculate XP progress (placeholder)
    const currentXP = user?.xp || 0;
    const nextLevelXP = 1000;
    const xpProgress = (currentXP / nextLevelXP) * 100;

    // Placeholder activity feed
    const recentActivities = [
        { id: 1, type: 'fight', message: 'Megnyertél egy harcot', time: '5 perce', color: 'text-green-400' },
        { id: 2, type: 'crime', message: 'Bűntényt követtél el', time: '12 perce', color: 'text-yellow-400' },
        { id: 3, type: 'gym', message: 'Edzenél a konditeremben', time: '1 órája', color: 'text-blue-400' },
    ];

    return (
        <DashboardLayout>
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="space-y-6">
                {/* Hero Section */}
                <div className="glass-panel p-6 border-l-4 border-primary animate-fade-in">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Avatar & Profile Info */}
                        <div className="lg:col-span-2 flex items-center gap-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary/30 ring-offset-4 ring-offset-gray-900">
                                    <img
                                        src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username}`}
                                        alt={user?.username}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                    LVL {Math.floor(currentXP / 100) + 1}
                                </div>
                            </div>

                            <div className="flex-1">
                                <h1
                                    className="text-4xl font-display font-bold text-white mb-2"
                                    style={{
                                        textShadow: '2px 2px 0px rgba(220, 38, 38, 0.3), -1px -1px 0px rgba(220, 38, 38, 0.1)'
                                    }}
                                >
                                    {user?.username}
                                </h1>
                                <p className="text-gray-400 mb-4">Underworld Operatív | Nexus-1 Szindikátus</p>

                                {/* XP Progress Bar */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Tapasztalat</span>
                                        <span className="text-primary font-semibold">{currentXP} / {nextLevelXP} XP</span>
                                    </div>
                                    <div className="h-3 bg-gray-900 rounded-full overflow-hidden border border-primary/30">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary to-red-400 transition-all duration-500 relative overflow-hidden"
                                            style={{ width: `${xpProgress}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Next Goal Card */}
                        <div className="glass-panel p-4 border-l-4 border-yellow-500">
                            <div className="flex items-start gap-3">
                                <TrendingUp className="w-6 h-6 text-yellow-500 mt-1" />
                                <div>
                                    <h3 className="text-sm font-semibold text-yellow-500 mb-1">Következő Cél</h3>
                                    <p className="text-white font-display">Lépj szintet!</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Még {nextLevelXP - currentXP} XP kell a következő szinthez
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Grid - Stats + Activity Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column (2/3) - Stats */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Resource Stats */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-display font-bold text-white">Erőforrások</h2>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRefillEnergy}
                                    disabled={isRefilling}
                                    className="text-xs"
                                >
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    {isRefilling ? 'Töltés...' : 'Dev: Töltés'}
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="animate-fade-in delay-100">
                                    <StatCard
                                        label="Készpénz"
                                        value={`$${user?.cash || '0'}`}
                                        icon={DollarSign}
                                        color="text-success"
                                    />
                                </div>
                                <div className="animate-fade-in delay-200">
                                    <StatCard
                                        label="Energia"
                                        value={`${user?.energy || 0} / ${user?.maxEnergy || 100}`}
                                        icon={Zap}
                                        color="text-secondary"
                                    />
                                </div>
                                <div className="animate-fade-in delay-300">
                                    <StatCard
                                        label="Bátorság"
                                        value={`${user?.nerve || 0} / ${user?.maxNerve || 10}`}
                                        icon={Shield}
                                        color="text-primary"
                                    />
                                </div>
                                <div className="animate-fade-in delay-400">
                                    <StatCard
                                        label="HP"
                                        value={`${user?.hp || 0} / ${user?.maxHp || 100}`}
                                        icon={Heart}
                                        color="text-success"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Combat Stats */}
                        <div>
                            <h2 className="text-xl font-display font-bold text-white mb-4 animate-fade-in delay-100">
                                Harci Statisztikák
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="animate-fade-in delay-200">
                                    <StatCard
                                        label="Erő"
                                        value={user?.stats?.str || 0}
                                        bonus={user?.computed?.bonuses.str}
                                        icon={Dumbbell}
                                        color="text-red-500"
                                        variant="strength"
                                    />
                                </div>
                                <div className="animate-fade-in delay-300">
                                    <StatCard
                                        label="Állóképesség"
                                        value={user?.stats?.tol || 0}
                                        bonus={user?.computed?.bonuses.def}
                                        icon={Shield}
                                        color="text-green-500"
                                        variant="defense"
                                    />
                                </div>
                                <div className="animate-fade-in delay-400">
                                    <StatCard
                                        label="Intelligencia"
                                        value={user?.stats?.int || 0}
                                        icon={Target}
                                        color="text-blue-500"
                                        variant="intelligence"
                                    />
                                </div>
                                <div className="animate-fade-in delay-500">
                                    <StatCard
                                        label="Gyorsaság"
                                        value={user?.stats?.spd || 0}
                                        bonus={user?.computed?.bonuses.spd}
                                        icon={Zap}
                                        color="text-yellow-500"
                                        variant="speed"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (1/3) - Activity Feed */}
                    <div className="lg:col-span-1">
                        <div className="glass-panel p-6 border-l-4 border-blue-500 animate-fade-in delay-200 sticky top-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Activity className="w-5 h-5 text-blue-500" />
                                <h2 className="text-lg font-display font-bold text-white">Legutóbbi Események</h2>
                            </div>
                            <div className="space-y-4">
                                {recentActivities.map((activity, index) => (
                                    <div
                                        key={activity.id}
                                        className={`flex items-start gap-3 p-3 rounded-lg bg-gray-900/50 border border-gray-800 animate-fade-in`}
                                        style={{ animationDelay: `${300 + index * 100}ms` }}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${activity.color} mt-2`} />
                                        <div className="flex-1">
                                            <p className="text-sm text-white">{activity.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}

                                {recentActivities.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Még nincsenek események</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
