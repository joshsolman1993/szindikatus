import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: number | string;
    bonus?: number;
    icon: LucideIcon;
    color?: string;
}

export const StatCard = ({ label, value, bonus, icon: Icon, color = 'text-gray-400' }: StatCardProps) => {
    return (
        <div className="bg-surface border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm text-gray-400 mb-1">{label}</div>
                    <div className="text-2xl font-display font-bold text-white">
                        {value}
                        {bonus && bonus > 0 ? (
                            <span className="text-sm text-green-400 ml-2">(+{bonus})</span>
                        ) : null}
                    </div>
                </div>
                <div className={`p-3 rounded-full bg-gray-900 ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
};
