import { X } from 'lucide-react';
import { Button } from './Button';

interface CombatResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    result: {
        winner: boolean;
        moneyStolen: number;
        xpGained: number;
        damageDealt: number;
        damageTaken: number;
        logs: string[];
    } | null;
}

export const CombatResultModal = ({ isOpen, onClose, result }: CombatResultModalProps) => {
    if (!isOpen || !result) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-surface border-2 border-gray-800 rounded-lg max-w-md w-full p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-2xl font-display font-bold ${result.winner ? 'text-success' : 'text-primary'}`}>
                        {result.winner ? '🎉 GYŐZELEM!' : '💀 VERESÉG!'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Combat Logs */}
                <div className="mb-4 space-y-2">
                    {result.logs.map((log, index) => (
                        <div
                            key={index}
                            className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-gray-300"
                        >
                            {log}
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    {result.winner && result.moneyStolen > 0 && (
                        <div className="bg-success/10 border border-success rounded p-3">
                            <div className="text-xs text-gray-400">Pénz ellopva</div>
                            <div className="text-lg font-display font-bold text-success">
                                ${result.moneyStolen}
                            </div>
                        </div>
                    )}
                    {result.xpGained > 0 && (
                        <div className="bg-blue-500/10 border border-blue-500 rounded p-3">
                            <div className="text-xs text-gray-400">XP szerzett</div>
                            <div className="text-lg font-display font-bold text-blue-500">
                                +{result.xpGained}
                            </div>
                        </div>
                    )}
                    {result.damageDealt > 0 && (
                        <div className="bg-primary/10 border border-primary rounded p-3">
                            <div className="text-xs text-gray-400">Okozott sebzés</div>
                            <div className="text-lg font-display font-bold text-primary">
                                {result.damageDealt} HP
                            </div>
                        </div>
                    )}
                    {result.damageTaken > 0 && (
                        <div className="bg-secondary/10 border border-secondary rounded p-3">
                            <div className="text-xs text-gray-400">Kapott sebzés</div>
                            <div className="text-lg font-display font-bold text-secondary">
                                {result.damageTaken} HP
                            </div>
                        </div>
                    )}
                </div>

                {/* Close Button */}
                <Button onClick={onClose} variant="primary" className="w-full">
                    Rendben
                </Button>
            </div>
        </div>
    );
};
