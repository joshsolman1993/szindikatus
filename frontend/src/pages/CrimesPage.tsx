import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { CrimeCard } from '../components/dashboard/CrimeCard';
import { Skeleton } from '../components/ui/Skeleton';
import { ToastContainer } from '../components/ui/Toast';
import { useToast } from '../hooks/useToast';
import { useGameSound } from '../hooks/useGameSound';
import { getCrimes, commitCrime } from '../api/crimes';
import type { Crime } from '../types';

export const CrimesPage = () => {
    const { user, refreshProfile } = useAuth();
    const { toasts, addToast, removeToast } = useToast();
    const { playCash, playError } = useGameSound();
    const [crimes, setCrimes] = useState<Crime[]>([]);
    const [loading, setLoading] = useState(true);
    const [committingCrime, setCommittingCrime] = useState<string | null>(null);

    useEffect(() => {
        loadCrimes();
    }, []);

    const loadCrimes = async () => {
        try {
            const data = await getCrimes();
            setCrimes(data);
        } catch (error) {
            addToast('Hiba a bűntények betöltésekor.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCommitCrime = async (crimeId: string) => {
        setCommittingCrime(crimeId);
        try {
            const result = await commitCrime(crimeId);

            if (result.success) {
                playCash(); // Play cash sound on success
                addToast(`Siker! Szereztél $${result.moneyGained}-t!`, 'success');
            } else {
                playError(); // Play error sound on failure
                addToast(result.message || 'A bűntény nem sikerült.', 'warning');
            }

            // Refresh user profile to update energy and cash
            await refreshProfile();
        } catch (error: any) {
            playError(); // Play error sound on exception
            const errorMessage = error.response?.data?.message || 'Hiba történt a bűntény elkövetésekor.';
            addToast(errorMessage, 'error');
        } finally {
            setCommittingCrime(null);
        }
    };

    return (
        <DashboardLayout>
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Bűntények</h1>
                    <p className="text-gray-400">Válassz egy bűntényt és szerezz pénzt!</p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array(6).fill(0).map((_, i) => (
                            <div key={i} className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl h-[200px] animate-pulse flex flex-col justify-between">
                                <div>
                                    <Skeleton width="50%" height={24} className="mb-4" />
                                    <div className="space-y-2">
                                        <Skeleton width="100%" height={16} />
                                        <Skeleton width="80%" height={16} />
                                    </div>
                                </div>
                                <Skeleton width="100%" height={40} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {crimes.map((crime) => (
                            <CrimeCard
                                key={crime.id}
                                crime={crime}
                                userEnergy={user?.energy || 0}
                                onCommit={handleCommitCrime}
                                isLoading={committingCrime === crime.id}
                            />
                        ))}
                    </div>
                )}

                {!loading && crimes.length === 0 && (
                    <div className="text-center py-12 bg-surface border border-gray-800 rounded-lg">
                        <p className="text-gray-400">Jelenleg nincsenek elérhető bűntények.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};
