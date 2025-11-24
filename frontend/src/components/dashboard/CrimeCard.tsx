import { Button } from '../ui/Button';
import { Zap, DollarSign } from 'lucide-react';
import type { Crime } from '../../types';

interface CrimeCardProps {
    crime: Crime;
    userEnergy: number;
    onCommit: (crimeId: string) => void;
    isLoading?: boolean;
}

export const CrimeCard = ({ crime, userEnergy, onCommit, isLoading }: CrimeCardProps) => {
    const canAfford = userEnergy >= crime.energyCost;

    return (
        <div className="bg-surface border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-all">
            <div className="flex flex-col h-full">
                <div className="flex-1">
                    <h3 className="text-lg font-display font-bold text-white mb-2">{crime.name}</h3>
                    <p className="text-sm text-gray-400 mb-4">{crime.description}</p>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="flex items-center gap-2 text-xs">
                            <Zap className="w-4 h-4 text-secondary" />
                            <span className={canAfford ? 'text-gray-300' : 'text-primary'}>
                                {crime.energyCost} Energia
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <DollarSign className="w-4 h-4 text-success" />
                            <span className="text-gray-300">
                                ${crime.minReward} - ${crime.maxReward}
                            </span>
                        </div>
                    </div>

                    <div className="text-xs text-gray-500 mb-2">
                        Nehézség: {crime.difficulty} | Siker: {crime.successRate}%
                    </div>
                </div>

                <Button
                    onClick={() => onCommit(crime.id)}
                    disabled={!canAfford || isLoading}
                    className="w-full"
                    variant={canAfford ? 'primary' : 'outline'}
                >
                    {isLoading ? 'Végrehajtás...' : canAfford ? 'Végrehajtás' : 'Nincs elég energia'}
                </Button>
            </div>
        </div>
    );
};
