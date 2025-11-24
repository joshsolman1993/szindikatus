import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export const RegisterPage = () => {
    const [username, setUsername] = useState('');
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
            // 1. Regisztráció
            await apiClient.post('/auth/register', { username, email, password });

            // 2. Automatikus bejelentkezés
            const loginResponse = await apiClient.post('/auth/login', { email, password });
            await login(loginResponse.data.access_token);

            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Hiba történt a regisztráció során.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-8 bg-surface p-8 rounded-lg border border-gray-800 shadow-2xl">
                <div className="text-center">
                    <h2 className="text-3xl font-display font-bold text-white">Regisztráció</h2>
                    <p className="mt-2 text-gray-400">Csatlakozz a Szindikátushoz</p>
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
                            label="Felhasználónév"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="GengszterNeve"
                        />
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
                            minLength={6}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Feldolgozás...' : 'Regisztráció'}
                    </Button>

                    <div className="text-center text-sm">
                        <span className="text-gray-400">Már van fiókod? </span>
                        <Link to="/login" className="text-primary hover:text-red-400 font-medium">
                            Jelentkezz be
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
