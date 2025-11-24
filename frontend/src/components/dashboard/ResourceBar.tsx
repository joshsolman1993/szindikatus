interface ResourceBarProps {
    label: string;
    current: number;
    max: number;
    color: 'primary' | 'secondary' | 'success';
    icon?: React.ReactNode;
}

export const ResourceBar = ({ label, current, max, color, icon }: ResourceBarProps) => {
    const percentage = Math.min((current / max) * 100, 100);

    const colorClasses = {
        primary: 'bg-primary',
        secondary: 'bg-secondary',
        success: 'bg-success',
    };

    return (
        <div className="flex-1 min-w-[200px]">
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-sm font-medium text-gray-300">{label}</span>
                </div>
                <span className="text-xs text-gray-400">
                    {current} / {max}
                </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                <div
                    className={`h-full ${colorClasses[color]} transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};
