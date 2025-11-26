import { useState } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { useGameSound } from '../hooks/useGameSound';
import { coinflip, spin } from '../api/casino';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Dices, DollarSign, RotateCcw, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CasinoPage = () => {
    const { user, refreshProfile } = useAuth();
    const { addToast } = useToast();
    const { playCash, playClick, playError } = useGameSound();

    const [activeTab, setActiveTab] = useState<'coinflip' | 'slots'>('coinflip');
    const [betAmount, setBetAmount] = useState<number>(100);
    const [isLoading, setIsLoading] = useState(false);

    // Coinflip State
    const [coinResult, setCoinResult] = useState<'head' | 'tail' | null>(null);
    const [isFlipping, setIsFlipping] = useState(false);

    // Slots State
    const [reels, setReels] = useState(['🍒', '🍒', '🍒']);
    const [isSpinning, setIsSpinning] = useState(false);
    const [lastWin, setLastWin] = useState<number | null>(null);

    const handleCoinflip = async (choice: 'head' | 'tail') => {
        if (!user) return;
        if (betAmount > parseInt(user.cash)) {
            addToast('Nincs elég pénzed!', 'error');
            playError();
            return;
        }

        setIsLoading(true);
        setIsFlipping(true);
        playClick();

        // Animation delay
        setTimeout(async () => {
            try {
                const data = await coinflip(betAmount, choice);
                setCoinResult(data.result);

                if (data.won) {
                    addToast(`Nyertél! Új egyenleg: $${data.newBalance}`, 'success');
                    playCash();
                } else {
                    addToast(`Vesztettél. Új egyenleg: $${data.newBalance}`, 'error');
                }
                await refreshProfile();
            } catch (error: any) {
                addToast(error.response?.data?.message || 'Hiba történt', 'error');
                playError();
            } finally {
                setIsLoading(false);
                setIsFlipping(false);
            }
        }, 1000);
    };

    const handleSpin = async () => {
        if (!user) return;
        if (betAmount > parseInt(user.cash)) {
            addToast('Nincs elég pénzed!', 'error');
            playError();
            return;
        }

        setIsLoading(true);
        setIsSpinning(true);
        playClick();
        setLastWin(null);

        // Fake spinning animation
        const interval = setInterval(() => {
            setReels([
                ['🍒', '🍋', '🔔', '💎', '7️⃣'][Math.floor(Math.random() * 5)],
                ['🍒', '🍋', '🔔', '💎', '7️⃣'][Math.floor(Math.random() * 5)],
                ['🍒', '🍋', '🔔', '💎', '7️⃣'][Math.floor(Math.random() * 5)]
            ]);
        }, 100);

        try {
            const data = await spin(betAmount);

            setTimeout(async () => {
                clearInterval(interval);
                setReels(data.symbols);

                if (data.won) {
                    addToast(`Nyertél $${data.payout}! (Szorzó: ${data.multiplier}x)`, 'success');
                    playCash();
                    setLastWin(data.payout);
                } else {
                    addToast('Nem nyertél.', 'info');
                }
                await refreshProfile();
                setIsLoading(false);
                setIsSpinning(false);
            }, 2000);

        } catch (error: any) {
            clearInterval(interval);
            addToast(error.response?.data?.message || 'Hiba történt', 'error');
            playError();
            setIsLoading(false);
            setIsSpinning(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-4xl mx-auto">
                {/* Header */}
                <div className="glass-panel p-6 border-l-4 border-purple-500 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                            <Dices className="w-8 h-8 text-purple-500" />
                            Neon Kaszinó
                        </h1>
                        <p className="text-gray-400">Próbálj szerencsét a Szindikátus legmenőbb klubjában.</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-400">Egyenleged</p>
                        <p className="text-2xl font-bold text-success">${user?.cash}</p>
                    </div>
                </div>

                {/* Game Selector */}
                <div className="flex gap-4">
                    <Button
                        variant={activeTab === 'coinflip' ? 'primary' : 'outline'}
                        onClick={() => setActiveTab('coinflip')}
                        className="flex-1"
                    >
                        <Coins className="w-4 h-4 mr-2" />
                        Pénzfeldobás
                    </Button>
                    <Button
                        variant={activeTab === 'slots' ? 'primary' : 'outline'}
                        onClick={() => setActiveTab('slots')}
                        className="flex-1"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Nyerőgép
                    </Button>
                </div>

                {/* Game Area */}
                <div className="glass-panel p-8 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-purple-900/10 pointer-events-none" />

                    {/* Bet Input */}
                    <div className="w-full max-w-xs mb-8 z-10">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Tét összege ($)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                                type="number"
                                value={betAmount}
                                onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value) || 0))}
                                className="pl-10 text-center text-lg"
                                min={1}
                            />
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'coinflip' ? (
                            <motion.div
                                key="coinflip"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full flex flex-col items-center"
                            >
                                <div className="mb-12 relative">
                                    <motion.div
                                        className={`w-32 h-32 rounded-full border-4 flex items-center justify-center text-4xl font-bold shadow-[0_0_30px_rgba(168,85,247,0.5)] ${coinResult === 'head' ? 'bg-yellow-500 border-yellow-300 text-yellow-900' :
                                                coinResult === 'tail' ? 'bg-gray-400 border-gray-300 text-gray-900' :
                                                    'bg-purple-600 border-purple-400 text-white'
                                            }`}
                                        animate={{
                                            rotateY: isFlipping ? 1800 : 0,
                                            scale: isFlipping ? [1, 1.2, 1] : 1
                                        }}
                                        transition={{ duration: 1, ease: "easeInOut" }}
                                    >
                                        {isFlipping ? '?' : coinResult === 'head' ? 'FEJ' : coinResult === 'tail' ? 'ÍRÁS' : '$'}
                                    </motion.div>
                                </div>

                                <div className="flex gap-6">
                                    <Button
                                        size="lg"
                                        onClick={() => handleCoinflip('head')}
                                        disabled={isLoading}
                                        className="w-32 bg-yellow-600 hover:bg-yellow-500"
                                    >
                                        FEJ
                                    </Button>
                                    <Button
                                        size="lg"
                                        onClick={() => handleCoinflip('tail')}
                                        disabled={isLoading}
                                        className="w-32 bg-gray-600 hover:bg-gray-500"
                                    >
                                        ÍRÁS
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="slots"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full flex flex-col items-center"
                            >
                                <div className="flex gap-4 mb-12 p-6 bg-black/40 rounded-xl border border-purple-500/30 shadow-inner">
                                    {reels.map((symbol, i) => (
                                        <div key={i} className="w-24 h-32 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg border border-gray-700 flex items-center justify-center text-5xl shadow-lg overflow-hidden relative">
                                            <motion.div
                                                animate={{ y: isSpinning ? [0, -100, 0] : 0 }}
                                                transition={{ repeat: isSpinning ? Infinity : 0, duration: 0.1 }}
                                            >
                                                {symbol}
                                            </motion.div>
                                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none" />
                                        </div>
                                    ))}
                                </div>

                                {lastWin !== null && lastWin > 0 && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-1/2 -translate-y-1/2 text-4xl font-bold text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] z-20"
                                    >
                                        NYEREMÉNY: ${lastWin}
                                    </motion.div>
                                )}

                                <Button
                                    size="lg"
                                    onClick={handleSpin}
                                    disabled={isLoading}
                                    className="w-48 text-lg py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border-none shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                                >
                                    {isLoading ? 'PÖRGETÉS...' : 'PÖRGETÉS'}
                                </Button>

                                <div className="mt-8 text-sm text-gray-400 bg-black/20 p-4 rounded-lg">
                                    <p>🍒 3x = 5x Tét | 7️⃣ 3x = 50x Tét (JACKPOT)</p>
                                    <p>2x Bármi = Tét visszajár</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </DashboardLayout>
    );
};
