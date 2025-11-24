import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { getTopPlayers, getRichestPlayers, getTopClans, type ClanLeaderboardItem } from '../api/leaderboard';
import { type PublicUser } from '../api/users';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, DollarSign, Shield, Medal } from 'lucide-react';

export const LeaderboardPage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'xp' | 'cash' | 'clans'>('xp');
    const [players, setPlayers] = useState<PublicUser[]>([]);
    const [clans, setClans] = useState<ClanLeaderboardItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'xp') {
                const data = await getTopPlayers();
                setPlayers(data);
            } else if (activeTab === 'cash') {
                const data = await getRichestPlayers();
                setPlayers(data);
            } else {
                const data = await getTopClans();
                setClans(data);
            }
        } catch (error) {
            console.error('Failed to load leaderboard', error);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (index: number) => {
        if (index === 0) return <Medal className="w-6 h-6 text-yellow-500" />;
        if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
        if (index === 2) return <Medal className="w-6 h-6 text-amber-700" />;
        return <span className="font-bold text-gray-500 w-6 text-center">{index + 1}</span>;
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Ranglista</h1>
                    <p className="text-gray-400">A város legjobbjai. Te köztük vagy?</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveTab('xp')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${activeTab === 'xp' ? 'bg-primary text-black' : 'bg-surface border border-gray-800 text-gray-400 hover:text-white'}`}
                    >
                        <TrendingUp className="w-4 h-4" />
                        Legerősebbek
                    </button>
                    <button
                        onClick={() => setActiveTab('cash')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${activeTab === 'cash' ? 'bg-green-500 text-black' : 'bg-surface border border-gray-800 text-gray-400 hover:text-white'}`}
                    >
                        <DollarSign className="w-4 h-4" />
                        Leggazdagabbak
                    </button>
                    <button
                        onClick={() => setActiveTab('clans')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${activeTab === 'clans' ? 'bg-secondary text-black' : 'bg-surface border border-gray-800 text-gray-400 hover:text-white'}`}
                    >
                        <Shield className="w-4 h-4" />
                        Top Bandák
                    </button>
                </div>

                {/* Content */}
                <div className="bg-surface border border-gray-800 rounded-lg overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-gray-400">Betöltés...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-900/50 text-gray-400 text-sm uppercase">
                                    <tr>
                                        <th className="p-4 w-16 text-center">#</th>
                                        <th className="p-4">Név</th>
                                        <th className="p-4 text-right">
                                            {activeTab === 'xp' ? 'XP' : activeTab === 'cash' ? 'Készpénz' : 'Össz XP'}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {activeTab === 'clans' ? (
                                        clans.map((clan, index) => (
                                            <tr key={clan.id} className={`hover:bg-gray-800/50 transition-colors ${user?.clanId === clan.id ? 'bg-secondary/10' : ''}`}>
                                                <td className="p-4 flex justify-center items-center">
                                                    {getRankIcon(index)}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="bg-gray-800 text-gray-300 font-bold px-2 py-0.5 rounded text-xs">
                                                            [{clan.tag}]
                                                        </span>
                                                        <span className="font-bold text-white">{clan.name}</span>
                                                        <span className="text-xs text-gray-500">({clan.memberCount} tag)</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right font-mono text-secondary font-bold">
                                                    {parseInt(clan.totalXp).toLocaleString()} XP
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        players.map((player, index) => (
                                            <tr key={player.id} className={`hover:bg-gray-800/50 transition-colors ${user?.id === player.id ? 'bg-primary/10' : ''}`}>
                                                <td className="p-4 flex justify-center items-center">
                                                    {getRankIcon(index)}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={player.avatarUrl} alt={player.username} className="w-8 h-8 rounded-full border border-gray-700" />
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                {player.clanTag && (
                                                                    <span className="text-xs font-bold bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded">
                                                                        [{player.clanTag}]
                                                                    </span>
                                                                )}
                                                                <span className="font-bold text-white">{player.username}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right font-mono font-bold">
                                                    {activeTab === 'xp' ? (
                                                        <span className="text-primary">{(player.xp || 0).toLocaleString()} XP</span>
                                                    ) : (
                                                        <span className="text-green-500">${parseInt(player.cash || '0').toLocaleString()}</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                            {((activeTab !== 'clans' && players.length === 0) || (activeTab === 'clans' && clans.length === 0)) && (
                                <div className="p-12 text-center text-gray-500">Nincs megjeleníthető adat.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};
