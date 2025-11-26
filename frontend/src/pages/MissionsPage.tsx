import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { Button } from '../components/ui/Button';
import { useToast } from '../hooks/useToast';
import { getMissions, claimMissionReward, UserMission } from '../api/missions';
import { useAuth } from '../context/AuthContext';
import { ClipboardList, CheckCircle, Lock, Trophy, Star, DollarSign } from 'lucide-react';

export const MissionsPage = () => {
    const { refreshUser } = useAuth();
    const { addToast } = useToast();
    const [missions, setMissions] = useState<UserMission[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'DAILY' | 'STORY'>('DAILY');
    const [claimingId, setClaimingId] = useState<number | null>(null);

    const fetchMissions = async () => {
        try {
            const data = await getMissions();
            setMissions(data);
        } catch (error) {
            console.error('Failed to fetch missions:', error);
            addToast('Nem sikerült betölteni a küldetéseket.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMissions();
    }, []);

    const handleClaim = async (userMission: UserMission) => {
        setClaimingId(userMission.id);
        try {
            const result = await claimMissionReward(userMission.id);
            addToast(result.message, 'success');

            // Update local state
            setMissions(prev => prev.map(m => {
                if (m.id === userMission.id) {
                    return { ...m, isClaimed: true };
                }
                return m;
            }));

            // Refresh user stats (cash, xp)
            refreshUser();
        } catch (error: any) {
            addToast(error.response?.data?.message || 'Hiba történt a jutalom felvételekor.', 'error');
        } finally {
            setClaimingId(null);
        }
    };

    const filteredMissions = missions.filter(m => m.mission.type === activeTab);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="glass-panel p-6 border-l-4 border-yellow-500 animate-fade-in">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-500/20 rounded-lg">
                            <ClipboardList className="w-8 h-8 text-yellow-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-display font-bold text-white">Küldetések</h1>
                            <p className="text-gray-400">Teljesítsd a feladatokat extra jutalmakért!</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-gray-700 pb-2">
                    <button
                        onClick={() => setActiveTab('DAILY')}
                        className={`px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'DAILY'
                            ? 'bg-yellow-500/20 text-yellow-400 border-b-2 border-yellow-500'
                            : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        Napi Küldetések
                    </button>
                    <button
                        onClick={() => setActiveTab('STORY')}
                        className={`px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'STORY'
                            ? 'bg-purple-500/20 text-purple-400 border-b-2 border-purple-500'
                            : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        Karrier
                    </button>
                </div>

                {/* Mission List */}
                {loading ? (
                    <div className="text-center py-12 text-gray-400">Küldetések betöltése...</div>
                ) : (
                    <div className="grid gap-4">
                        {filteredMissions.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 italic">Nincs elérhető küldetés ebben a kategóriában.</div>
                        ) : (
                            filteredMissions.map((um) => {
                                const progressPercent = Math.min(100, (um.progress / um.mission.requirementValue) * 100);

                                return (
                                    <div
                                        key={um.id}
                                        className={`glass-panel p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-all ${um.isClaimed ? 'opacity-60 grayscale' : 'hover:bg-white/5'}`}
                                    >
                                        {/* Info */}
                                        <div className="flex-1 w-full">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-lg font-bold text-white">{um.mission.title}</h3>
                                                {um.isCompleted && !um.isClaimed && (
                                                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30 animate-pulse">
                                                        KÉSZ!
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-400 mb-3">{um.mission.description}</p>

                                            {/* Progress Bar */}
                                            <div className="w-full max-w-md bg-gray-800 h-2 rounded-full overflow-hidden relative">
                                                <div
                                                    className={`h-full transition-all duration-500 ${um.isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                                                    style={{ width: `${progressPercent}%` }}
                                                />
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                {um.progress} / {um.mission.requirementValue}
                                            </div>
                                        </div>

                                        {/* Rewards */}
                                        <div className="flex items-center gap-4 bg-black/20 p-3 rounded-lg min-w-[150px] justify-center">
                                            {um.mission.rewardCash > 0 && (
                                                <div className="flex flex-col items-center">
                                                    <DollarSign className="w-4 h-4 text-green-400" />
                                                    <span className="text-sm font-bold text-green-400">${um.mission.rewardCash}</span>
                                                </div>
                                            )}
                                            {um.mission.rewardXp > 0 && (
                                                <div className="flex flex-col items-center">
                                                    <Star className="w-4 h-4 text-blue-400" />
                                                    <span className="text-sm font-bold text-blue-400">{um.mission.rewardXp} XP</span>
                                                </div>
                                            )}
                                            {um.mission.rewardDiamonds > 0 && (
                                                <div className="flex flex-col items-center">
                                                    <Trophy className="w-4 h-4 text-purple-400" />
                                                    <span className="text-sm font-bold text-purple-400">{um.mission.rewardDiamonds} D</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Button */}
                                        <div className="w-full md:w-auto">
                                            {um.isClaimed ? (
                                                <Button variant="secondary" disabled className="w-full md:w-32 opacity-50 cursor-not-allowed">
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Felvéve
                                                </Button>
                                            ) : um.isCompleted ? (
                                                <Button
                                                    variant="primary"
                                                    className="w-full md:w-32 bg-green-600 hover:bg-green-700 border-green-500"
                                                    onClick={() => handleClaim(um)}
                                                    disabled={claimingId === um.id}
                                                >
                                                    {claimingId === um.id ? '...' : 'Jutalom'}
                                                </Button>
                                            ) : (
                                                <Button variant="secondary" disabled className="w-full md:w-32 opacity-50 cursor-not-allowed">
                                                    <Lock className="w-4 h-4 mr-2" />
                                                    Folyamatban
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};
