import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { ToastContainer } from '../components/ui/Toast';
import { useToast } from '../hooks/useToast';
import { getPlayers, type PublicUser } from '../api/users';
import { Search, Swords } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface PlayerCardProps {
    player: PublicUser;
    onAttack: (playerId: string) => void;
}

const PlayerCard = ({ player, onAttack }: PlayerCardProps) => {
    return (
        <div className="bg-surface border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-all">
            <div className="flex items-center gap-4 mb-4">
                <img
                    src={player.avatarUrl}
                    alt={player.username}
                    className="w-16 h-16 rounded-full border-2 border-gray-700"
                />
                <div className="flex-1">
                    <h3 className="text-lg font-display font-bold text-white">{player.username}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>Erő becslés:</span>
                        <span className="text-primary font-semibold">{player.totalStats}</span>
                    </div>
                </div>
            </div>

            <Button
                onClick={() => onAttack(player.id)}
                disabled
                className="w-full"
                variant="outline"
            >
                <Swords className="w-4 h-4 mr-2" />
                Támadás (Hamarosan)
            </Button>
        </div>
    );
};

export const TheStreetsPage = () => {
    const { toasts, addToast, removeToast } = useToast();
    const [players, setPlayers] = useState<PublicUser[]>([]);
    const [filteredPlayers, setFilteredPlayers] = useState<PublicUser[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

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

    const handleAttack = (playerId: string) => {
        console.log('Támadás indítása...', playerId);
        addToast('A harcrendszer hamarosan elérhető!', 'info');
    };

    return (
        <DashboardLayout>
            <ToastContainer toasts={toasts} removeToast={removeToast} />

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
                            />
                        ))}
                    </div>
                )}

                <div className="bg-surface border border-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-400">
                        💡 <span className="text-white font-semibold">Tipp:</span> A harcrendszer a következő frissítésben kerül bevezetésre.
                        Addig is gyűjtsd az erőt az edzőteremben!
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
};
