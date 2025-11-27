import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { ToastContainer } from '../components/ui/Toast';
import { useToast } from '../hooks/useToast';
import {
    getMarketListings,
    getMyListings,
    buyListing,
    cancelListing,
    type MarketListing,
} from '../api/market';
import { ShoppingCart, Store, Tag, User, TrendingUp, X, MessageSquare } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { Button } from '../components/ui/Button';

interface ListingCardProps {
    listing: MarketListing;
    onBuy?: (listingId: string) => void;
    onCancel?: (listingId: string) => void;
    isBuying?: boolean;
    isCanceling?: boolean;
    isMyListing?: boolean;
}

const ListingCard = ({ listing, onBuy, onCancel, isBuying, isCanceling, isMyListing }: ListingCardProps) => {
    const item = listing.inventory.item;
    const price = parseInt(listing.price);
    const { openPrivateChat } = useChat();

    return (
        <div className="bg-surface border-2 border-gray-800 hover:border-gray-700 rounded-lg p-4 transition-all">
            <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-display font-bold text-white">{item.name}</h3>
                    <div className="flex items-center gap-1 text-accent font-bold text-lg">
                        <span>{price.toLocaleString()}</span>
                        <span className="text-sm">€</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                    {!isMyListing && (
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{listing.seller.username}</span>
                            <button
                                onClick={() => openPrivateChat(listing.seller.id, listing.seller.username)}
                                className="text-gray-400 hover:text-white transition-colors ml-1"
                                title="Üzenet küldése"
                            >
                                <MessageSquare className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    <div className="inline-block px-2 py-1 bg-gray-900 border border-gray-700 rounded text-xs">
                        {item.type}
                    </div>
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

            {isMyListing && onCancel ? (
                <Button
                    onClick={() => onCancel(listing.id)}
                    disabled={isCanceling}
                    className="w-full"
                    variant="outline"
                >
                    {isCanceling ? 'Művelet...' : (
                        <>
                            <X className="w-4 h-4 mr-2" />
                            Visszavonás
                        </>
                    )}
                </Button>
            ) : onBuy ? (
                <Button
                    onClick={() => onBuy(listing.id)}
                    disabled={isBuying}
                    className="w-full"
                    variant="primary"
                >
                    {isBuying ? 'Vásárlás...' : (
                        <>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Megvétel
                        </>
                    )}
                </Button>
            ) : null}
        </div>
    );
};

export const PlayerMarketPage = () => {
    const { toasts, addToast, removeToast } = useToast();
    const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
    const [marketListings, setMarketListings] = useState<MarketListing[]>([]);
    const [myListings, setMyListings] = useState<MarketListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [buyingId, setBuyingId] = useState<string | null>(null);
    const [cancelingId, setCancelingId] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'buy') {
                const data = await getMarketListings();
                setMarketListings(data);
            } else {
                const data = await getMyListings();
                setMyListings(data);
            }
        } catch (error) {
            addToast('Hiba az adatok betöltésekor.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = async (listingId: string) => {
        setBuyingId(listingId);
        try {
            const result = await buyListing(listingId);
            addToast(result.message, 'success');
            await loadData();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Hiba történt a vásárlás során.';
            addToast(errorMessage, 'error');
        } finally {
            setBuyingId(null);
        }
    };

    const handleCancel = async (listingId: string) => {
        setCancelingId(listingId);
        try {
            const result = await cancelListing(listingId);
            addToast(result.message, 'success');
            await loadData();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Hiba történt a visszavonás során.';
            addToast(errorMessage, 'error');
        } finally {
            setCancelingId(null);
        }
    };

    const currentListings = activeTab === 'buy' ? marketListings : myListings;

    return (
        <DashboardLayout>
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Játékos Piac</h1>
                    <p className="text-gray-400">Kereskedj tárgyakkal más játékosokkal!</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-gray-800">
                    <button
                        onClick={() => setActiveTab('buy')}
                        className={`px-6 py-3 font-semibold transition-all relative ${activeTab === 'buy'
                            ? 'text-accent'
                            : 'text-gray-400 hover:text-gray-300'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            Vásárlás
                        </div>
                        {activeTab === 'buy' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"></div>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('sell')}
                        className={`px-6 py-3 font-semibold transition-all relative ${activeTab === 'sell'
                            ? 'text-accent'
                            : 'text-gray-400 hover:text-gray-300'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Store className="w-4 h-4" />
                            Saját Ajánlatok
                        </div>
                        {activeTab === 'sell' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"></div>
                        )}
                    </button>
                </div>

                {/* Info Message */}
                {activeTab === 'sell' && (
                    <div className="bg-surface border border-gray-800 rounded-lg p-4">
                        <p className="text-sm text-gray-400">
                            💡 <span className="text-white font-semibold">Tipp:</span> A leltáradból
                            tudod felteni a tárgyaidat eladásra. Látogass el a Leltár oldalra!
                        </p>
                    </div>
                )}

                {activeTab === 'buy' && (
                    <div className="bg-surface border border-gray-800 rounded-lg p-4">
                        <p className="text-sm text-gray-400">
                            <TrendingUp className="w-4 h-4 inline mr-1" />
                            <span className="text-white font-semibold">Információ:</span> Az ár 5%-os
                            piaci adót tartalmaz. Az eladó az ár 95%-át kapja meg.
                        </p>
                    </div>
                )}

                {/* Listings Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400">Betöltés...</div>
                    </div>
                ) : currentListings.length === 0 ? (
                    <div className="text-center py-12 bg-surface border border-gray-800 rounded-lg">
                        <Tag className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                        <p className="text-gray-400">
                            {activeTab === 'buy'
                                ? 'Jelenleg nincsenek elérhető ajánlatok a piacon.'
                                : 'Még nem tettél fel semmit eladásra.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentListings.map((listing) => (
                            <ListingCard
                                key={listing.id}
                                listing={listing}
                                onBuy={activeTab === 'buy' ? handleBuy : undefined}
                                onCancel={activeTab === 'sell' ? handleCancel : undefined}
                                isBuying={buyingId === listing.id}
                                isCanceling={cancelingId === listing.id}
                                isMyListing={activeTab === 'sell'}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};
