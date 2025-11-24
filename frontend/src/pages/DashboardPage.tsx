import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { StatCard } from '../components/dashboard/StatCard';
import { Button } from '../components/ui/Button';
import { ToastContainer } from '../components/ui/Toast';
import { useToast } from '../hooks/useToast';
import { refillEnergy } from '../api/user';
import { DollarSign, Zap, Heart, Shield, Sparkles, Dumbbell, Target } from 'lucide-react';

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

    return (
        <DashboardLayout>
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white mb-2">Vezérlőpult</h1>
                        <p className="text-gray-400">Üdv a belső körben, <span className="text-primary font-semibold">{user?.username}</span>!</p>
                    </div>

                    {/* Dev Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefillEnergy}
                        disabled={isRefilling}
                        className="text-xs"
                    >
                        <Sparkles className="w-3 h-3 mr-1" />
                        {isRefilling ? 'Töltés...' : 'Dev: Energia Töltés'}
                    </Button>
                </div>

                {/* Stats Grid */}
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

                {/* Combat Stats Grid */}
                <h2 className="text-xl font-display font-bold text-white mt-2 mb-4 animate-fade-in delay-100">Harci Statisztikák</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="animate-fade-in delay-200">
                        <StatCard
                            label="Erő"
                            value={user?.stats?.str || 0}
                            bonus={user?.computed?.bonuses.str}
                            icon={Dumbbell}
                            color="text-red-500"
                        />
                    </div>
                    <div className="animate-fade-in delay-300">
                        <StatCard
                            label="Állóképesség"
                            value={user?.stats?.tol || 0}
                            bonus={user?.computed?.bonuses.def}
                            icon={Shield}
                            color="text-green-500"
                        />
                    </div>
                    <div className="animate-fade-in delay-400">
                        <StatCard
                            label="Intelligencia"
                            value={user?.stats?.int || 0}
                            icon={Target}
                            color="text-blue-500"
                        />
                    </div>
                    <div className="animate-fade-in delay-500">
                        <StatCard
                            label="Gyorsaság"
                            value={user?.stats?.spd || 0}
                            bonus={user?.computed?.bonuses.spd}
                            icon={Zap}
                            color="text-yellow-500"
                        />
                    </div>
                </div>

                {/* Welcome Panel */}
                <div className="glass-panel p-6 animate-fade-in delay-300">
                    <h2 className="text-xl font-display font-bold text-white mb-3">
                        <span className="text-primary">⚡</span> Kezdjük!
                    </h2>
                    <p className="text-gray-400 mb-4">
                        Készen állsz az első bűntényre? Menj a <span className="text-primary font-semibold">Bűntények</span> menüpontra
                        és kezdd el a pénzszerzést!
                    </p>
                    <div className="flex gap-2">
                        <div className="text-xs bg-gray-900 px-3 py-2 rounded border border-gray-700">
                            ✓ Energia: {user?.energy || 0}
                        </div>
                        <div className="text-xs bg-gray-900 px-3 py-2 rounded border border-gray-700">
                            ✓ Készpénz: ${user?.cash || '0'}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
