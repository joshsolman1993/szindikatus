import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { ToastContainer } from '../components/ui/Toast';
import { CombatResultModal } from '../components/ui/CombatResultModal';
import { useToast } from '../hooks/useToast';
import { getPlayers, type PublicUser } from '../api/users';
import { attackPlayer, type FightResult } from '../api/fight';
import { Search, Swords } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface PlayerCardProps {
    player: PublicUser;
    onAttack: (playerId: string) => void;
    isAttacking: boolean;
}

const PlayerCard = ({ player, onAttack, isAttacking }: PlayerCardProps) => {
    return (
        <div className="bg-surface border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-all">
            <div className="flex items-center gap-4 mb-4">
                <img
                    src={player.avatarUrl}
                    alt={player.username}
                    className="w-16 h-16 rounded-full border-2 border-gray-700"
                />
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        {player.clanTag && (
                            <span className="text-xs font-bold bg-primary text-black px-1.5 py-0.5 rounded">
                                [{player.clanTag}]
                            </span>
                        )}
                        <h3 className="text-lg font-display font-bold text-white">{player.username}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>Erő becslés:</span>
                        <span className="text-primary font-semibold">{player.totalStats}</span>
                    </div>
                </div>
            </div>

            <Button
                onClick={() => onAttack(player.id)}
                disabled={isAttacking}
                className="w-full"
                variant="primary"
            >
                <Swords className="w-4 h-4 mr-2" />
                {isAttacking ? 'Támadás...' : 'Támadás'}
            </Button>
        </div>
    );
};

export const TheStreetsPage = () => {
    const { refreshProfile } = useAuth();
    const { toasts, addToast, removeToast } = useToast();
    const [players, setPlayers] = useState<PublicUser[]>([]);
    const [filteredPlayers, setFilteredPlayers] = useState<PublicUser[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [attackingPlayerId, setAttackingPlayerId] = useState<string | null>(null);
    const [combatResult, setCombatResult] = useState<FightResult | null>(null);
    const [showCombatModal, setShowCombatModal] = useState(false);

    useEffect(() => {
        loadPlayers();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredPlayers(players);
        } else {
            const filtered = players.filter(player =>
                player.username.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredPlayers(filtered);
        }
    }, [searchQuery, players]);

    const loadPlayers = async () => {
        try {
            const data = await getPlayers();
            setPlayers(data);
            setFilteredPlayers(data);
        } catch (error) {
            addToast('Hiba a játékosok betöltésekor.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAttack = async (playerId: string) => {
        setAttackingPlayerId(playerId);
        try {
            const result = await attackPlayer(playerId);
            setCombatResult(result);
            setShowCombatModal(true);

            // Frissítjük a user profilt
            await refreshProfile();

            // Ha győztünk vagy vesztettünk, Toast után is mutatjuk
            if (result.winner) {
                addToast(`Győzelem! +$${result.moneyStolen}`, 'success');
            } else {
                addToast('Vereség! Jobban kell edzened...', 'error');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Hiba történt a támadás során.';
            addToast(errorMessage, 'error');
        } finally {
            setAttackingPlayerId(null);
        }
    };

    const handleCloseCombatModal = () => {
        setShowCombatModal(false);
        setCombatResult(null);
    };

    return (
        <DashboardLayout>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <CombatResultModal
                isOpen={showCombatModal}
                onClose={handleCloseCombatModal}
                result={combatResult}
            />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Az Utca</h1>
                    <p className="text-gray-400">Találd meg az ellenségeidet és küzdj meg velük!</p>
                </div>

                {/* Search Bar */}
                <div className="bg-surface border border-gray-800 rounded-lg p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                            type="text"
                            placeholder="Keresés név alapján..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400">Betöltés...</div>
                    </div>
                ) : filteredPlayers.length === 0 ? (
                    <div className="text-center py-12 bg-surface border border-gray-800 rounded-lg">
                        <p className="text-gray-400">
                            {searchQuery ? 'Nincs találat a keresésre.' : 'Jelenleg nincsenek elérhető játékosok.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredPlayers.map((player) => (
                            <PlayerCard
                                key={player.id}
                                player={player}
                                onAttack={handleAttack}
                                isAttacking={attackingPlayerId === player.id}
                            />
                        ))}
                    </div>
                )}

                <div className="bg-surface border border-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-400">
                        💡 <span className="text-white font-semibold">Tipp:</span> Támadáshoz 2 bátorság szükséges.
                        Győzelem esetén az ellenfél készpénzének 10%-át ellophatod!
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
};
