import { useState } from 'react';
import { X, Tag } from 'lucide-react';
import { Button } from './Button';

interface SellItemModalProps {
    itemName: string;
    inventoryId: string;
    onClose: () => void;
    onConfirm: (inventoryId: string, price: string) => void;
    isLoading: boolean;
}

export const SellItemModal = ({ itemName, inventoryId, onClose, onConfirm, isLoading }: SellItemModalProps) => {
    const [price, setPrice] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (price && parseInt(price) > 0) {
            onConfirm(inventoryId, price);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-surface border-2 border-gray-800 rounded-lg max-w-md w-full p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-display font-bold text-white">Tárgy Eladása</h2>
                        <p className="text-gray-400 text-sm mt-1">{itemName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Eladási Ár (€)
                        </label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="number"
                                min="1"
                                step="1"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Írd be az árat..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Az eladási ár 95%-át fogod megkapni (5% piaci adó).
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="outline"
                            className="flex-1"
                            disabled={isLoading}
                        >
                            Mégse
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="flex-1"
                            disabled={isLoading || !price || parseInt(price) <= 0}
                        >
                            {isLoading ? 'Feltöltés...' : 'Eladásra Kínálás'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
