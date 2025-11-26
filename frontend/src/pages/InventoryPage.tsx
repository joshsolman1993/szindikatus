import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { ToastContainer } from '../components/ui/Toast';
import { useToast } from '../hooks/useToast';
import { getUserInventory, equipItem, createListing, type InventoryItem } from '../api/market';
import { Package, Check, X, Tag } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SellItemModal } from '../components/ui/SellItemModal';

interface InventoryCardProps {
    inventoryItem: InventoryItem;
    onEquip: (inventoryId: string) => void;
    onSell: (inventoryId: string, itemName: string) => void;
    isEquipping: boolean;
}

const InventoryCard = ({ inventoryItem, onEquip, onSell, isEquipping }: InventoryCardProps) => {
    const isEquipped = inventoryItem.isEquipped;
    const isListed = (inventoryItem as any).isListed || false; // Check if item is listed
    const item = inventoryItem.item;

    return (
        <div className={`bg-surface border-2 rounded-lg p-4 transition-all ${isEquipped ? 'border-success' : isListed ? 'border-accent' : 'border-gray-800 hover:border-gray-700'
            }`}>
            {isEquipped && (
                <div className="flex items-center gap-2 text-success text-sm font-semibold mb-2">
                    <Check className="w-4 h-4" />
                    Felszerelve
                </div>
            )}

            {isListed && (
                <div className="flex items-center gap-2 text-accent text-sm font-semibold mb-2">
                    <Tag className="w-4 h-4" />
                    Piacon
                </div>
            )}

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

            <div className="flex gap-2">
                <Button
                    onClick={() => onEquip(inventoryItem.id)}
                    disabled={isEquipping || isListed}
                    className="flex-1"
                    variant={isEquipped ? 'outline' : 'primary'}
                >
                    {isEquipping ? 'Művelet...' : isEquipped ? (
                        <>
                            <X className="w-4 h-4 mr-2" />
                            Levétel
                        </>
                    ) : (
                        <>
                            <Check className="w-4 h-4 mr-2" />
                            Felszerelés
                        </>
                    )}
                </Button>

                {!isListed && (
                    <Button
                        onClick={() => onSell(inventoryItem.id, item.name)}
                        disabled={isEquipping || isEquipped}
                        className="flex-1"
                        variant="outline"
                    >
                        <Tag className="w-4 h-4 mr-2" />
                        Eladás
                    </Button>
                )}
            </div>
        </div>
    );
};

export const InventoryPage = () => {
    const { toasts, addToast, removeToast } = useToast();
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [equippingItemId, setEquippingItemId] = useState<string | null>(null);

    // Selling state
    const [sellModalOpen, setSellModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [selectedItemName, setSelectedItemName] = useState<string>('');
    const [isListing, setIsListing] = useState(false);

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        try {
            const data = await getUserInventory();
            setInventory(data);
        } catch (error) {
            addToast('Hiba a leltár betöltésekor.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEquip = async (inventoryId: string) => {
        setEquippingItemId(inventoryId);
        try {
            const result = await equipItem(inventoryId);
            addToast(result.message, 'success');
            await loadInventory(); // Reload inventory to see changes
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Hiba történt a művelet során.';
            addToast(errorMessage, 'error');
        } finally {
            setEquippingItemId(null);
        }
    };

    const handleSellClick = (inventoryId: string, itemName: string) => {
        setSelectedItemId(inventoryId);
        setSelectedItemName(itemName);
        setSellModalOpen(true);
    };

    const handleSellConfirm = async (inventoryId: string, price: string) => {
        setIsListing(true);
        try {
            await createListing(inventoryId, price);
            addToast('Tárgy sikeresen feltéve a piacra!', 'success');
            setSellModalOpen(false);
            await loadInventory();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Hiba történt a listázás során.';
            addToast(errorMessage, 'error');
        } finally {
            setIsListing(false);
        }
    };

    return (
        <DashboardLayout>
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            {sellModalOpen && selectedItemId && (
                <SellItemModal
                    itemName={selectedItemName}
                    inventoryId={selectedItemId}
                    onClose={() => setSellModalOpen(false)}
                    onConfirm={handleSellConfirm}
                    isLoading={isListing}
                />
            )}

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Leltár</h1>
                    <p className="text-gray-400">Rendezd be a felszerelésedet és növeld az erődet!</p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400">Betöltés...</div>
                    </div>
                ) : inventory.length === 0 ? (
                    <div className="text-center py-12 bg-surface border border-gray-800 rounded-lg">
                        <Package className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                        <p className="text-gray-400">
                            A leltárad üres. Látogass el a Feketepiacra és szerezz be felszerelést!
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {inventory.map((inventoryItem) => (
                                <InventoryCard
                                    key={inventoryItem.id}
                                    inventoryItem={inventoryItem}
                                    onEquip={handleEquip}
                                    onSell={handleSellClick}
                                    isEquipping={equippingItemId === inventoryItem.id}
                                />
                            ))}
                        </div>

                        <div className="bg-surface border border-gray-800 rounded-lg p-4">
                            <p className="text-sm text-gray-400">
                                💡 <span className="text-white font-semibold">Tipp:</span> Típusonként (Fegyver, Páncél, Jármű)
                                egyszerre csak egy tárgyat szerelhetsz fel. Az új felszerelés automatikusan leveszi a régit!
                            </p>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};
