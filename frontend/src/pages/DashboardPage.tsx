
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export const DashboardPage = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-display font-bold">Vezérlőpult</h1>
                    <Button variant="outline" onClick={logout}>Kijelentkezés</Button>
                </div>

                <div className="bg-surface border border-gray-800 rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Üdv a belső körben, <span className="text-primary">{user?.username}</span>!</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-gray-900 p-4 rounded border border-gray-700">
                            <div className="text-gray-400 text-sm">Készpénz</div>
                            <div className="text-2xl font-display text-success">${user?.cash}</div>
                        </div>
                        <div className="bg-gray-900 p-4 rounded border border-gray-700">
                            <div className="text-gray-400 text-sm">Energia</div>
                            <div className="text-2xl font-display text-secondary">{user?.energy} / 100</div>
                        </div>
                        <div className="bg-gray-900 p-4 rounded border border-gray-700">
                            <div className="text-gray-400 text-sm">Bátorság</div>
                            <div className="text-2xl font-display text-primary">{user?.nerve} / 10</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
