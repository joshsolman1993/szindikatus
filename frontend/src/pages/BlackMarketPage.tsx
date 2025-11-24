import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { ToastContainer } from '../components/ui/Toast';
import { useToast } from '../hooks/useToast';
import { getShopItems, buyItem, type ShopItem } from '../api/market';
import { DollarSign, ShoppingCart } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface ShopItemCardProps {
    item: ShopItem;
    onBuy: (itemId: string) => void;
    isBuying: boolean;
    userCash: number;
}

const ShopItemCard = ({ item, onBuy, isBuying, userCash }: ShopItemCardProps) => {
    const canAfford = userCash >= item.cost;

    return (
        <div className="bg-surface border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-all">
            <div className="mb-4">
                <h3 className="text-lg font-display font-bold text-white mb-2">{item.name}</h3>
                <div className="inline-block px-2 py-1 bg-gray-900 border border-gray-700 rounded text-xs text-gray-400 mb-3">
                    {item.type}
                </div>

                <div className="space-y-1 text-sm">
                    {item.bonusStr > 0 && (
                        <div className="flex justify-between text-gray-400">
                            <span>Erő:</span>
                            <span className="text-red-500 font-semibold">+{item.bonusStr}</span>
                        </div>
                    )}
                    {item.bonusDef > 0 && (
                        <div className="flex justify-between text-gray-400">
                            <span>Védelem:</span>
                            <span className="text-green-500 font-semibold">+{item.bonusDef}</span>
                        </div>
                    )}
                    {item.bonusSpd > 0 && (
                        <div className="flex justify-between text-gray-400">
                            <span>Gyorsaság:</span>
                            <span className="text-yellow-500 font-semibold">+{item.bonusSpd}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-success font-display font-bold text-xl">
                    <DollarSign className="w-5 h-5" />
                    {item.cost}
                </div>
            </div>

            <Button
                onClick={() => onBuy(item.id)}
                disabled={!canAfford || isBuying}
                className="w-full"
                variant={canAfford ? 'primary' : 'outline'}
            >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {isBuying ? 'Vásárlás...' : canAfford ? 'Vásárlás' : 'Nincs elég pénzed'}
            </Button>
        </div>
    );
};

export const BlackMarketPage = () => {
    const { user, refreshProfile } = useAuth();
    const { toasts, addToast, removeToast } = useToast();
    const [items, setItems] = useState<ShopItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [buyingItemId, setBuyingItemId] = useState<string | null>(null);

    useEffect(() => {
        loadShopItems();
    }, []);

    const loadShopItems = async () => {
        try {
            const data = await getShopItems();
            setItems(data);
        } catch (error) {
            addToast('Hiba a bolt betöltésekor.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = async (itemId: string) => {
        setBuyingItemId(itemId);
        try {
            const result = await buyItem(itemId);
            await refreshProfile();
            addToast(result.message, 'success');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Hiba történt a vásárlás során.';
            addToast(errorMessage, 'error');
        } finally {
            setBuyingItemId(null);
        }
    };

    const userCash = parseInt(user?.cash || '0');

    return (
        <DashboardLayout>
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Feketepiac</h1>
                    <p className="text-gray-400">Szerezd be a legjobb felszerelést az árnyékvilágban!</p>
                </div>

                <div className="bg-surface border border-gray-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-success font-display font-semibold text-lg">
                        <DollarSign className="w-5 h-5" />
                        Készpénz: ${user?.cash || '0'}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400">Betöltés...</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map((item) => (
                            <ShopItemCard
                                key={item.id}
                                item={item}
                                onBuy={handleBuy}
                                isBuying={buyingItemId === item.id}
                                userCash={userCash}
                            />
                        ))}
                    </div>
                )}

                <div className="bg-surface border border-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-400">
                        💡 <span className="text-white font-semibold">Tipp:</span> A tárgyakat a Leltár oldalon tudod felszerelni.
                        Felszerelt tárgyak növelik a statisztikáidat harcban!
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
};
