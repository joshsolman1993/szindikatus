import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { ToastContainer } from '../components/ui/Toast';
import { useToast } from '../hooks/useToast';
import { getClans, createClan, joinClan, leaveClan, getClanDetails, getClanUpgrades, buyUpgrade, getUpgradeDefinitions, type Clan, type ClanUpgrade } from '../api/clans';
import { Users, Shield, LogOut, Plus, Crown, TrendingUp, Building, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const CLAN_COST = 10000;

export const ClansPage = () => {
    const { user, refreshProfile } = useAuth();
    const { toasts, addToast, removeToast } = useToast();
    const [clans, setClans] = useState<Clan[]>([]);
    const [myClan, setMyClan] = useState<Clan | null>(null);
    const [upgrades, setUpgrades] = useState<ClanUpgrade[]>([]);
    const [upgradeDefinitions, setUpgradeDefinitions] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [createForm, setCreateForm] = useState({ name: '', tag: '', description: '' });
    const [isCreating, setIsCreating] = useState(false);
    const [isUpgrading, setIsUpgrading] = useState(false);

    useEffect(() => {
        loadData();
    }, [user?.clanId]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (user?.clanId) {
                const [clanData, upgradesData, definitionsData] = await Promise.all([
                    getClanDetails(user.clanId),
                    getClanUpgrades(user.clanId),
                    getUpgradeDefinitions()
                ]);
                setMyClan(clanData);
                setUpgrades(upgradesData);
                setUpgradeDefinitions(definitionsData);
            } else {
                const clansList = await getClans();
                setClans(clansList);
            }
        } catch (error) {
            addToast('Hiba az adatok betöltésekor.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleBuyUpgrade = async (type: string) => {
        if (!confirm('Biztosan megveszed ezt a fejlesztést?')) return;

        setIsUpgrading(true);
        try {
            await buyUpgrade(type);
            addToast('Fejlesztés sikeres!', 'success');
            await loadData(); // Reload all data to update bank and levels
        } catch (error: any) {
            addToast(error.response?.data?.message || 'Hiba a vásárláskor.', 'error');
        } finally {
            setIsUpgrading(false);
        }
    };

    const handleCreateClan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (parseInt(user?.cash || '0') < CLAN_COST) {
            addToast('Nincs elég pénzed a banda alapításához!', 'error');
            return;
        }

        setIsCreating(true);
        try {
            await createClan(createForm);
            addToast('Banda sikeresen megalapítva!', 'success');
            await refreshProfile(); // This will trigger useEffect to load myClan
        } catch (error: any) {
            addToast(error.response?.data?.message || 'Hiba a létrehozáskor.', 'error');
        } finally {
            setIsCreating(false);
        }
    };

    const handleJoinClan = async (clanId: string) => {
        try {
            await joinClan(clanId);
            addToast('Sikeres csatlakozás!', 'success');
            await refreshProfile();
        } catch (error: any) {
            addToast(error.response?.data?.message || 'Hiba a csatlakozáskor.', 'error');
        }
    };

    const handleLeaveClan = async () => {
        if (!confirm('Biztosan ki akarsz lépni? Ha vezér vagy, a banda megszűnik!')) return;

        try {
            await leaveClan();
            addToast('Sikeresen kiléptél.', 'success');
            setMyClan(null);
            await refreshProfile();
        } catch (error: any) {
            addToast(error.response?.data?.message || 'Hiba a kilépéskor.', 'error');
        }
    };

    return (
        <DashboardLayout>
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Bandák</h1>
                    <p className="text-gray-400">Szerveződj, uralkodj, pusztíts!</p>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-400">Betöltés...</div>
                ) : user?.clanId && myClan ? (
                    // MY CLAN VIEW
                    <div className="space-y-6">
                        <div className="bg-surface border border-gray-800 rounded-lg p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="bg-primary text-black font-bold px-2 py-1 rounded text-sm">
                                            [{myClan.tag}]
                                        </span>
                                        <h2 className="text-2xl font-display font-bold text-white">{myClan.name}</h2>
                                    </div>
                                    <p className="text-gray-400">{myClan.description || 'Nincs leírás.'}</p>
                                </div>
                                <Button variant="outline" onClick={handleLeaveClan} className="text-red-500 hover:text-red-400 border-red-900 hover:border-red-500">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Kilépés
                                </Button>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                Tagok ({myClan.members?.length})
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {myClan.members?.map((member: any) => (
                                    <div key={member.id} className="bg-gray-900/50 p-4 rounded border border-gray-800 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                                            {member.clanRank === 'LEADER' ? <Crown className="w-5 h-5 text-yellow-500" /> : <Users className="w-5 h-5 text-gray-500" />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{member.username}</div>
                                            <div className="text-xs text-gray-500">{member.clanRank}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CLAN TREASURY & UPGRADES */}
                        <div className="bg-surface border border-gray-800 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Building className="w-6 h-6 text-secondary" />
                                    Klán Kincstár & Fejlesztések
                                </h3>
                                <div className="bg-gray-900 px-4 py-2 rounded border border-gray-800 text-right">
                                    <div className="text-xs text-gray-400">Bank Egyenleg</div>
                                    <div className="text-xl font-bold text-green-400">${parseInt(myClan.bank || '0').toLocaleString()}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {upgradeDefinitions && Object.values(upgradeDefinitions).map((def: any) => {
                                    const currentUpgrade = upgrades.find(u => u.type === def.type);
                                    const currentLevel = currentUpgrade?.level || 0;
                                    const nextCost = def.baseCost * (currentLevel + 1);
                                    const isMaxLevel = currentLevel >= def.maxLevel;
                                    const canAfford = parseInt(myClan.bank || '0') >= nextCost;
                                    const isLeader = myClan.leaderId === user?.id;

                                    return (
                                        <div key={def.type} className="bg-gray-900/50 border border-gray-800 rounded-lg p-5 flex flex-col">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 bg-gray-800 rounded-lg">
                                                    {def.type === 'FORTRESS' && <Shield className="w-6 h-6 text-blue-400" />}
                                                    {def.type === 'TRAINING_GROUND' && <Zap className="w-6 h-6 text-yellow-400" />}
                                                    {def.type === 'BLACK_MARKET_CONN' && <TrendingUp className="w-6 h-6 text-green-400" />}
                                                </div>
                                                <div className="text-xs font-bold bg-gray-800 px-2 py-1 rounded text-gray-300">
                                                    Lvl {currentLevel} / {def.maxLevel}
                                                </div>
                                            </div>

                                            <h4 className="text-lg font-bold text-white mb-1">{def.name}</h4>
                                            <p className="text-sm text-gray-400 mb-4 flex-grow">{def.description}</p>

                                            <div className="mt-auto">
                                                <div className="text-xs text-gray-500 mb-1">Bónusz: <span className="text-primary">{def.bonus}</span></div>

                                                {isMaxLevel ? (
                                                    <Button disabled className="w-full bg-gray-800 text-gray-500 border-gray-700">
                                                        Max Szint
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={() => handleBuyUpgrade(def.type)}
                                                        disabled={!isLeader || !canAfford || isUpgrading}
                                                        className={`w-full ${!canAfford ? 'opacity-50' : ''}`}
                                                        variant={isLeader ? 'primary' : 'outline'}
                                                    >
                                                        {isUpgrading ? 'Vásárlás...' : `Fejlesztés ($${nextCost.toLocaleString()})`}
                                                    </Button>
                                                )}
                                                {!isLeader && !isMaxLevel && (
                                                    <div className="text-xs text-center text-gray-600 mt-2">Csak a Vezér fejleszthet</div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    // NO CLAN VIEW
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Create Clan Panel */}
                        <div className="lg:col-span-1">
                            <div className="bg-surface border border-gray-800 rounded-lg p-6 sticky top-24">
                                <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-primary" />
                                    Banda Alapítása
                                </h2>
                                <form onSubmit={handleCreateClan} className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Banda Neve</label>
                                        <Input
                                            value={createForm.name}
                                            onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                                            placeholder="Pl. The Syndicate"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Tag (Max 4)</label>
                                        <Input
                                            value={createForm.tag}
                                            onChange={(e) => setCreateForm({ ...createForm, tag: e.target.value.toUpperCase() })}
                                            placeholder="BOSS"
                                            maxLength={4}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Leírás</label>
                                        <Input
                                            value={createForm.description}
                                            onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                                            placeholder="Rövid leírás..."
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <div className="text-sm text-gray-400 mb-2 flex justify-between">
                                            <span>Költség:</span>
                                            <span className="text-red-400 font-bold">${CLAN_COST}</span>
                                        </div>
                                        <Button
                                            id="create-clan-btn"
                                            type="submit"
                                            className="w-full"
                                            disabled={isCreating || parseInt(user?.cash || '0') < CLAN_COST}
                                        >
                                            {isCreating ? 'Alapítás...' : 'Létrehozás'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Clan List */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-secondary" />
                                Elérhető Bandák
                            </h2>

                            {clans.length === 0 ? (
                                <div className="text-gray-500 text-center py-8 bg-surface border border-gray-800 rounded-lg">
                                    Még nincsenek bandák. Légy te az első vezér!
                                </div>
                            ) : (
                                clans.map((clan) => (
                                    <div key={clan.id} className="bg-surface border border-gray-800 rounded-lg p-4 flex items-center justify-between hover:border-gray-700 transition-colors">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="bg-gray-800 text-gray-300 font-bold px-2 py-0.5 rounded text-xs">
                                                    [{clan.tag}]
                                                </span>
                                                <h3 className="font-bold text-white">{clan.name}</h3>
                                            </div>
                                            <div className="text-sm text-gray-400 flex gap-4">
                                                <span>Tagok: {clan.members?.length || 0}</span>
                                                {clan.description && <span>• {clan.description}</span>}
                                            </div>
                                        </div>
                                        <Button size="sm" onClick={() => handleJoinClan(clan.id)}>
                                            Csatlakozás
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};
