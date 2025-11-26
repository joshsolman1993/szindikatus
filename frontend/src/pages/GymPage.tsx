import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { ToastContainer } from '../components/ui/Toast';
import { useToast } from '../hooks/useToast';
import { trainStat } from '../api/user';
import { Dumbbell, Shield, Zap, Target } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface StatConfig {
    key: string;
    label: string;
    icon: any;
    color: string;
    description: string;
}

const STATS: StatConfig[] = [
    { key: 'str', label: 'Erő', icon: Dumbbell, color: 'text-red-500', description: 'Növeli a támadóeröd' },
    { key: 'tol', label: 'Állóképesség', icon: Shield, color: 'text-green-500', description: 'Növeli a védekezésed' },
    { key: 'int', label: 'Intelligencia', icon: Target, color: 'text-blue-500', description: 'Növeli a bűntények sikerét' },
    { key: 'spd', label: 'Gyorsaság', icon: Zap, color: 'text-yellow-500', description: 'Növeli a támadási sorrendet' },
];

const ENERGY_COST = 10;

export const GymPage = () => {
    const { user, refreshProfile } = useAuth();
    const { toasts, addToast, removeToast } = useToast();
    const [trainingState, setTrainingState] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        refreshProfile();
    }, []);

    const handleTrain = async (statKey: string) => {
        setTrainingState({ ...trainingState, [statKey]: true });

        try {
            await trainStat(statKey);
            await refreshProfile();

            const statName = STATS.find(s => s.key === statKey)?.label || statKey;
            addToast(`Sikeres edzés! ${statName} növekedett!`, 'success');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Hiba történt az edzés során.';
            addToast(errorMessage, 'error');
        } finally {
            setTrainingState({ ...trainingState, [statKey]: false });
        }
    };

    return (
        <DashboardLayout>
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Konditerem</h1>
                    <p className="text-gray-400">Növeld a statisztikáidat és válj erősebbé!</p>
                </div>

                <div className="bg-surface border border-gray-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Zap className="w-4 h-4 text-secondary" />
                        <span>Edzés költsége: <span className="text-secondary font-semibold">{ENERGY_COST} Energia</span></span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {STATS.map((stat) => {
                        const Icon = stat.icon;
                        const currentValue = user?.stats?.[stat.key as keyof typeof user.stats] || 0;
                        const canAfford = (user?.energy || 0) >= ENERGY_COST;
                        const isTraining = trainingState[stat.key];

                        return (
                            <div
                                key={stat.key}
                                className="bg-surface border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-3 rounded-full bg-gray-900 ${stat.color}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-display font-bold text-white">{stat.label}</h3>
                                            <p className="text-xs text-gray-500">{stat.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-display font-bold text-white">{currentValue}</div>
                                        <div className="text-xs text-gray-500">Jelenlegi</div>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => handleTrain(stat.key)}
                                    disabled={!canAfford || isTraining}
                                    className="w-full"
                                    variant={canAfford ? 'primary' : 'outline'}
                                >
                                    {isTraining ? 'Edzés...' : canAfford ? `Edzés (${ENERGY_COST} ⚡)` : 'Nincs elég energia'}
                                </Button>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-surface border border-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-display font-bold text-white mb-3">💡 Tipp</h3>
                    <p className="text-gray-400 text-sm">
                        Minden edzés növeli a kiválasztott statisztikádat. Minél magasabb a statisztikád,
                        annál nagyobb a növekedés mértéke (1 + jelenlegi érték × 0.01).
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
};
