import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { Button } from '../components/ui/Button';
import { useToast } from '../hooks/useToast';
import { getMap, attackDistrict, type District } from '../api/territories';
import { useAuth } from '../context/AuthContext';
import { Map as MapIcon, Shield, Crosshair, DollarSign, Users } from 'lucide-react';

export const CityMapPage = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [districts, setDistricts] = useState<District[]>([]);
    const [loading, setLoading] = useState(true);
    const [attackingId, setAttackingId] = useState<number | null>(null);

    const fetchMap = async () => {
        try {
            const data = await getMap();
            setDistricts(data);
        } catch (error) {
            console.error('Failed to fetch map:', error);
            addToast('Nem sikerült betölteni a térképet.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMap();
        // Optional: Poll for updates or listen to socket events
    }, []);

    const handleAttack = async (district: District) => {
        if (!user?.clan) {
            addToast('Csak klántagok támadhatnak!', 'error');
            return;
        }

        setAttackingId(district.id);
        try {
            const result = await attackDistrict(district.id);
            addToast(result.message, result.success ? 'success' : 'info');

            // Update local state
            setDistricts(prev => prev.map(d => {
                if (d.id === district.id) {
                    return {
                        ...d,
                        defense: result.district.defense,
                        ownerClan: result.district.ownerClan,
                        ownerClanId: result.district.ownerClan ? result.district.ownerClan.id : null
                    };
                }
                return d;
            }));
        } catch (error: any) {
            addToast(error.response?.data?.message || 'Hiba történt a támadás során.', 'error');
        } finally {
            setAttackingId(null);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="glass-panel p-6 border-l-4 border-purple-500 animate-fade-in">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-lg">
                            <MapIcon className="w-8 h-8 text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-display font-bold text-white">Várostérkép</h1>
                            <p className="text-gray-400">Foglald el a kerületeket és szedj adót a bűnözőktől!</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-400">Térkép betöltése...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {districts.map((district) => {
                            const isOwner = user?.clan?.id === district.ownerClanId;
                            const defensePercent = (district.defense / district.maxDefense) * 100;

                            return (
                                <div
                                    key={district.id}
                                    className={`glass-panel overflow-hidden transition-all duration-300 hover:scale-[1.02] border-2 ${isOwner ? 'border-green-500/50' : district.ownerClanId ? 'border-red-500/50' : 'border-gray-700'
                                        }`}
                                >
                                    {/* Image / Header */}
                                    <div className="h-32 bg-gradient-to-br from-gray-800 to-gray-900 relative">
                                        {/* Placeholder for actual image */}
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-700 font-display text-4xl font-bold opacity-20 select-none">
                                            {district.name.substring(0, 2)}
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                            <h3 className="text-xl font-bold text-white font-display">{district.name}</h3>
                                        </div>

                                        {/* Tax Badge */}
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs text-yellow-400 flex items-center gap-1 border border-yellow-500/30">
                                            <DollarSign className="w-3 h-3" />
                                            <span>{(district.taxRate * 100).toFixed(0)}% Adó</span>
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-4">
                                        <p className="text-sm text-gray-400 h-10 line-clamp-2">{district.description}</p>

                                        {/* Owner Info */}
                                        <div className="flex items-center justify-between bg-black/30 p-2 rounded border border-white/5">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-300">Tulajdonos:</span>
                                            </div>
                                            <span className={`font-bold text-sm ${district.ownerClan ? 'text-white' : 'text-gray-500'}`}>
                                                {district.ownerClan ? `[${district.ownerClan.tag}] ${district.ownerClan.name}` : 'Senki'}
                                            </span>
                                        </div>

                                        {/* Defense Bar */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-400 flex items-center gap-1">
                                                    <Shield className="w-3 h-3" /> Védelem
                                                </span>
                                                <span className={`${defensePercent < 30 ? 'text-red-400' : 'text-blue-400'}`}>
                                                    {district.defense} / {district.maxDefense}
                                                </span>
                                            </div>
                                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-500 ${isOwner ? 'bg-green-500' : 'bg-blue-500'
                                                        }`}
                                                    style={{ width: `${defensePercent}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <Button
                                            className="w-full"
                                            variant={isOwner ? 'outline' : 'primary'}
                                            onClick={() => handleAttack(district)}
                                            disabled={attackingId === district.id}
                                        >
                                            {attackingId === district.id ? (
                                                <span className="animate-pulse">Művelet...</span>
                                            ) : isOwner ? (
                                                <span className="flex items-center gap-2 text-green-400">
                                                    <Shield className="w-4 h-4" /> Megerősítés
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2 text-red-400">
                                                    <Crosshair className="w-4 h-4" /> Támadás
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};
