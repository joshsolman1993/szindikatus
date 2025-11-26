import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTalents, learnTalent } from '../api/talents';
import type { Talent } from '../api/talents';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import { Brain, Zap, Shield, DollarSign, Crosshair, Lock, Star } from 'lucide-react';
import Confetti from 'react-confetti';
import { useSocket } from '../hooks/useSocket';

const useWindowSize = () => {
    const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    useEffect(() => {
        const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return size;
};

const TalentsPage: React.FC = () => {
    const { user, refreshProfile } = useAuth();
    const { socket } = useSocket();
    const [talents, setTalents] = useState<Talent[]>([]);
    const [loading, setLoading] = useState(true);
    const [showConfetti, setShowConfetti] = useState(false);
    const { width, height } = useWindowSize();

    useEffect(() => {
        const fetchTalents = async () => {
            try {
                const data = await getTalents();
                setTalents(data);
            } catch (error) {
                console.error('Failed to fetch talents', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTalents();
    }, []);

    useEffect(() => {
        if (socket) {
            const handleLevelUp = (data: any) => {
                console.log('Level Up Event!', data);
                setShowConfetti(true);
                refreshProfile();
                // Auto hide confetti after 10 seconds
                setTimeout(() => setShowConfetti(false), 10000);
            };

            socket.on('level-up', handleLevelUp);
            return () => {
                socket.off('level-up', handleLevelUp);
            };
        }
    }, [socket, refreshProfile]);

    const handleLearn = async (talentId: string) => {
        try {
            await learnTalent(talentId);
            await refreshProfile();
        } catch (error) {
            alert('Failed to learn talent: ' + ((error as any).response?.data?.message || 'Unknown error'));
        }
    };

    const tier1 = talents.filter(t => t.tier === 1);
    const tier2 = talents.filter(t => t.tier === 2);

    const renderTalent = (talent: Talent) => {
        const isLearned = user?.learnedTalents?.includes(talent.id);
        const isAvailable = !isLearned && (user?.talentPoints || 0) > 0 && (user?.level || 1) >= talent.requiredLevel && (!talent.requiredTalentId || user?.learnedTalents?.includes(talent.requiredTalentId));
        const isLocked = !isLearned && !isAvailable;

        let Icon = Brain;
        if (talent.id.includes('wisdom')) Icon = DollarSign;
        if (talent.id.includes('skin')) Icon = Shield;
        if (talent.id.includes('adrenaline')) Icon = Zap;
        if (talent.id.includes('sharpshooter')) Icon = Crosshair;
        if (talent.id.includes('banker')) Icon = DollarSign;

        return (
            <motion.div
                key={talent.id}
                whileHover={isAvailable || isLearned ? { scale: 1.05 } : {}}
                className={`p-4 rounded-lg border-2 flex flex-col items-center text-center w-48 m-2 relative transition-colors duration-300
                    ${isLearned ? 'border-yellow-500 bg-yellow-900/20 shadow-[0_0_15px_rgba(234,179,8,0.5)]' : ''}
                    ${isAvailable ? 'border-blue-500 bg-blue-900/20 cursor-pointer hover:bg-blue-900/40 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : ''}
                    ${isLocked ? 'border-gray-700 bg-gray-900/50 opacity-70 grayscale' : ''}
                `}
                onClick={() => isAvailable && handleLearn(talent.id)}
            >
                {isLocked && <Lock className="absolute top-2 right-2 w-4 h-4 text-gray-500" />}
                {isLearned && <Star className="absolute top-2 right-2 w-4 h-4 text-yellow-500 fill-yellow-500" />}

                <div className={`p-3 rounded-full mb-2 ${isLearned ? 'bg-yellow-500/20 text-yellow-500' : 'bg-gray-700/50 text-gray-400'}`}>
                    <Icon size={32} />
                </div>
                <h3 className="font-bold text-lg mb-1 text-white">{talent.name}</h3>
                <p className="text-xs text-gray-400 mb-2 min-h-[32px]">{talent.description}</p>

                {isAvailable && <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">Tanulás</span>}
                {isLearned && <span className="text-xs text-yellow-400 font-bold uppercase tracking-wider">Megtanulva</span>}
                {isLocked && <span className="text-xs text-red-500 font-bold">
                    {user?.level! < talent.requiredLevel ? `Szint ${talent.requiredLevel}+` : 'Zárolva'}
                </span>}
            </motion.div>
        );
    };

    return (
        <DashboardLayout title="Tehetségek">
            {showConfetti && (
                <div className="fixed inset-0 z-50 pointer-events-none">
                    <Confetti width={width} height={height} recycle={true} numberOfPieces={200} />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="bg-black/80 p-8 rounded-2xl border-4 border-yellow-500 text-center backdrop-blur-md"
                        >
                            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600 mb-4">SZINTLÉPÉS!</h1>
                            <p className="text-2xl text-white">Gratulálunk! Elérted a {user?.level}. szintet!</p>
                            <p className="text-xl text-yellow-400 mt-2">+1 Tehetségpont</p>
                        </motion.div>
                    </div>
                </div>
            )}

            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Tehetségfa</h2>
                <div className="inline-flex items-center bg-gray-900/80 px-8 py-3 rounded-full border border-yellow-500/30 shadow-lg backdrop-blur-sm">
                    <Brain className="text-yellow-500 mr-3" size={24} />
                    <span className="text-gray-300 mr-3 text-lg">Elérhető pontok:</span>
                    <span className="text-3xl font-bold text-yellow-500">{user?.talentPoints || 0}</span>
                </div>
            </div>

            {loading ? (
                <div className="text-center text-gray-500">Betöltés...</div>
            ) : (
                <div className="flex flex-col items-center space-y-12 pb-20">
                    {/* Tier 1 */}
                    <div className="w-full max-w-4xl">
                        <div className="flex items-center mb-6">
                            <div className="h-px bg-gray-800 flex-1"></div>
                            <h3 className="text-xl font-bold text-blue-400 mx-4 px-4 py-1 bg-blue-900/20 rounded border border-blue-500/30">Tier 1 (Szint 1+)</h3>
                            <div className="h-px bg-gray-800 flex-1"></div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                            {tier1.map(renderTalent)}
                        </div>
                    </div>

                    {/* Connector */}
                    <div className="h-12 w-1 bg-gradient-to-b from-gray-800 to-gray-800/50"></div>

                    {/* Tier 2 */}
                    <div className="w-full max-w-4xl">
                        <div className="flex items-center mb-6">
                            <div className="h-px bg-gray-800 flex-1"></div>
                            <h3 className="text-xl font-bold text-purple-400 mx-4 px-4 py-1 bg-purple-900/20 rounded border border-purple-500/30">Tier 2 (Szint 5+)</h3>
                            <div className="h-px bg-gray-800 flex-1"></div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                            {tier2.map(renderTalent)}
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default TalentsPage;
