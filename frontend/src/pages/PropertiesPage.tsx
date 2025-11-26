import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { useGameSound } from '../hooks/useGameSound';
import { getProperties, getMyProperties, buyProperty, collectIncome, type Property, type UserProperty } from '../api/properties';
import { Button } from '../components/ui/Button';
import { Building, DollarSign, Briefcase, Clock, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PropertiesPage = () => {
    const { user, refreshProfile } = useAuth();
    const { addToast } = useToast();
    const { playCash, playClick, playError } = useGameSound();

    const [activeTab, setActiveTab] = useState<'market' | 'my'>('market');
    const [properties, setProperties] = useState<Property[]>([]);
    const [myProperties, setMyProperties] = useState<UserProperty[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pendingIncome, setPendingIncome] = useState(0);

    useEffect(() => {
        loadData();
    }, []);

    // Dynamic income counter
    useEffect(() => {
        if (myProperties.length === 0) return;

        const calculateIncome = () => {
            let total = 0;
            const now = new Date();

            myProperties.forEach(up => {
                const lastCollected = new Date(up.lastCollectedAt);
                const diffMs = now.getTime() - lastCollected.getTime();
                const diffHours = diffMs / (1000 * 60 * 60);
                const cappedHours = Math.min(diffHours, 24);

                if (cappedHours > 0) {
                    total += Math.floor(cappedHours * up.property.incomePerHour);
                }
            });
            setPendingIncome(total);
        };

        calculateIncome();
        const interval = setInterval(calculateIncome, 10000); // Update every 10s

        return () => clearInterval(interval);
    }, [myProperties]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [marketData, myData] = await Promise.all([
                getProperties(),
                getMyProperties()
            ]);
            setProperties(marketData);
            setMyProperties(myData);
        } catch (error) {
            console.error(error);
            addToast('Hiba az adatok betöltésekor.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBuy = async (propertyId: number) => {
        if (!user) return;
        playClick();

        try {
            await buyProperty(propertyId);
            addToast('Sikeres vásárlás!', 'success');
            playCash();
            await refreshProfile();
            await loadData();
        } catch (error: any) {
            addToast(error.response?.data?.message || 'Hiba történt', 'error');
            playError();
        }
    };

    const handleCollect = async () => {
        if (pendingIncome <= 0) return;
        playClick();

        try {
            const data = await collectIncome();
            addToast(data.message, 'success');
            playCash();
            await refreshProfile();
            await loadData();
            setPendingIncome(0);
        } catch (error: any) {
            addToast(error.response?.data?.message || 'Hiba történt', 'error');
            playError();
        }
    };

    const isOwned = (propertyId: number) => {
        return myProperties.some(p => p.propertyId === propertyId);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="glass-panel p-6 border-l-4 border-blue-500 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                            <Building className="w-8 h-8 text-blue-500" />
                            Ingatlan Birodalom
                        </h1>
                        <p className="text-gray-400">Vásárolj ingatlanokat és élvezd a passzív jövedelmet.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                        <div className="text-right">
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Begyűjthető Bevétel</p>
                            <p className="text-2xl font-bold text-success font-mono">${pendingIncome.toLocaleString()}</p>
                        </div>
                        <Button
                            variant="primary"
                            onClick={handleCollect}
                            disabled={pendingIncome <= 0}
                            className="h-12 px-6"
                        >
                            <DollarSign className="w-5 h-5 mr-2" />
                            BEGYŰJTÉS
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4">
                    <Button
                        variant={activeTab === 'market' ? 'primary' : 'outline'}
                        onClick={() => setActiveTab('market')}
                        className="flex-1"
                    >
                        <Building className="w-4 h-4 mr-2" />
                        Ingatlan Piac
                    </Button>
                    <Button
                        variant={activeTab === 'my' ? 'primary' : 'outline'}
                        onClick={() => setActiveTab('my')}
                        className="flex-1"
                    >
                        <Briefcase className="w-4 h-4 mr-2" />
                        Saját Birodalom ({myProperties.length})
                    </Button>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="text-center py-12 text-gray-400">Betöltés...</div>
                ) : (
                    <AnimatePresence mode="wait">
                        {activeTab === 'market' ? (
                            <motion.div
                                key="market"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {properties.map((property) => (
                                    <div key={property.id} className="glass-panel overflow-hidden flex flex-col h-full group">
                                        <div className="h-48 overflow-hidden relative">
                                            <img
                                                src={property.imageUrl}
                                                alt={property.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                            <div className="absolute bottom-4 left-4">
                                                <h3 className="text-xl font-bold text-white">{property.name}</h3>
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <p className="text-gray-400 text-sm mb-4 flex-1">{property.description}</p>

                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="bg-gray-900/50 p-2 rounded border border-gray-800">
                                                    <p className="text-xs text-gray-500">Ár</p>
                                                    <p className="text-lg font-bold text-red-400">${property.cost.toLocaleString()}</p>
                                                </div>
                                                <div className="bg-gray-900/50 p-2 rounded border border-gray-800">
                                                    <p className="text-xs text-gray-500">Bevétel / óra</p>
                                                    <p className="text-lg font-bold text-green-400">${property.incomePerHour.toLocaleString()}</p>
                                                </div>
                                            </div>

                                            <Button
                                                variant={isOwned(property.id) ? 'outline' : 'primary'}
                                                onClick={() => handleBuy(property.id)}
                                                disabled={!!(isOwned(property.id) || (user && parseInt(user.cash) < property.cost))}
                                                className="w-full"
                                            >
                                                {isOwned(property.id) ? 'MÁR A TIÉD' : 'MEGVESZEM'}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="my"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-1 gap-4"
                            >
                                {myProperties.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <Building className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                        <p>Még nincsenek ingatlanjaid. Irány a piac!</p>
                                    </div>
                                ) : (
                                    myProperties.map((up) => (
                                        <div key={up.id} className="glass-panel p-4 flex items-center gap-6">
                                            <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                                                <img src={up.property.imageUrl} alt={up.property.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-white mb-1">{up.property.name}</h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                                        ${up.property.incomePerHour}/óra
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4 text-blue-500" />
                                                        Utolsó begyűjtés: {new Date(up.lastCollectedAt).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">Szint</p>
                                                <p className="text-2xl font-bold text-white">{up.level}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </DashboardLayout>
    );
};
