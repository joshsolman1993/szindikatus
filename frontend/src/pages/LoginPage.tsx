import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await apiClient.post('/auth/login', { email, password });
            await login(response.data.access_token);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Hiba történt a bejelentkezés során.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-8 bg-surface p-8 rounded-lg border border-gray-800 shadow-2xl">
                <div className="text-center">
                    <h2 className="text-3xl font-display font-bold text-white">Bejelentkezés</h2>
                    <p className="mt-2 text-gray-400">Add meg az adataidat a belépéshez</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded flex items-center gap-2">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input
                            label="Email cím"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="pelda@email.com"
                        />
                        <Input
                            label="Jelszó"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Betöltés...' : 'Belépés'}
                    </Button>

                    <div className="text-center text-sm">
                        <span className="text-gray-400">Nincs még fiókod? </span>
                        <Link to="/register" className="text-primary hover:text-red-400 font-medium">
                            Regisztrálj most
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
