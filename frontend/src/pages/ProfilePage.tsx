import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { Button } from '../components/ui/Button';
import { ToastContainer } from '../components/ui/Toast';
import { useToast } from '../hooks/useToast';
import { useGameSound } from '../hooks/useGameSound';
import { updateProfile } from '../api/users';
import { User, Edit3, Settings, LogOut, Calendar, Trophy } from 'lucide-react';

export const ProfilePage = () => {
    const { user, refreshProfile, logout } = useAuth();
    const { toasts, addToast, removeToast } = useToast();
    const { isMuted, toggleMute } = useGameSound();

    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bioText, setBioText] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setBioText((user as any).bio || '');
        }
    }, [user]);

    const handleSaveBio = async () => {
        if (bioText.length > 500) {
            addToast('A bio maximum 500 karakter hosszú lehet!', 'error');
            return;
        }

        setIsSaving(true);
        try {
            await updateProfile({ bio: bioText });
            await refreshProfile();
            setIsEditingBio(false);
            addToast('Bio sikeresen frissítve!', 'success');
        } catch (error) {
            addToast('Hiba történt a bio mentésekor.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleSound = async () => {
        const newValue = !isMuted;
        toggleMute();

        try {
            await updateProfile({ settings: { soundEnabled: !newValue } });
            await refreshProfile();
            addToast(`Hangeffektek ${!newValue ? 'bekapcsolva' : 'kikapcsolva'}!`, 'success');
        } catch (error) {
            addToast('Hiba történt a beállítás mentésekor.', 'error');
        }
    };

    const registrationDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('hu-HU') : 'N/A';
    const level = Math.floor((user?.xp || 0) / 100) + 1;

    return (
        <DashboardLayout>
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Profil</h1>
                    <p className="text-gray-400">Személyes információk és beállítások</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left - Avatar & Bio */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Avatar Card */}
                        <div className="glass-panel p-6 border-l-4 border-primary">
                            <div className="flex items-start gap-6">
                                <div className="relative flex-shrink-0">
                                    <img
                                        src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username}&backgroundColor=1f2937`}
                                        alt={user?.username}
                                        className="w-32 h-32 rounded-full ring-4 ring-primary/30"
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-primary text-white text-sm font-bold px-3 py-1 rounded-full">
                                        LVL {level}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h2 className="text-3xl font-display font-bold text-white mb-2">{user?.username}</h2>
                                    <p className="text-gray-400 mb-4">
                                        {(user as any)?.clan?.name ? `${(user as any).clan.name} tagja` : 'Banda nélküli operatív'}
                                    </p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800">
                                            <div className="text-xs text-gray-500 mb-1">Szint</div>
                                            <div className="text-lg font-display font-bold text-white">{level}</div>
                                        </div>
                                        <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800">
                                            <div className="text-xs text-gray-500 mb-1">XP</div>
                                            <div className="text-lg font-display font-bold text-secondary">{user?.xp || 0}</div>
                                        </div>
                                        <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800">
                                            <div className="text-xs text-gray-500 mb-1">Készpénz</div>
                                            <div className="text-lg font-display font-bold text-success">${user?.cash || '0'}</div>
                                        </div>
                                        <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800">
                                            <div className="text-xs text-gray-500 mb-1">Energia</div>
                                            <div className="text-lg font-display font-bold text-yellow-500">{user?.energy || 0}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bio Card */}
                        <div className="glass-panel p-6 border-l-4 border-blue-500">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-500" />
                                    <h3 className="text-lg font-display font-bold text-white">Bemutatkozás</h3>
                                </div>
                                {!isEditingBio && (
                                    <Button variant="outline" size="sm" onClick={() => setIsEditingBio(true)}>
                                        <Edit3 className="w-3 h-3 mr-1" />
                                        Szerkesztés
                                    </Button>
                                )}
                            </div>

                            {isEditingBio ? (
                                <div className="space-y-3">
                                    <textarea
                                        value={bioText}
                                        onChange={(e) => setBioText(e.target.value)}
                                        maxLength={500}
                                        rows={4}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                        placeholder="Írj magadról... (max 500 karakter)"
                                    />
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">{bioText.length} / 500 karakter</span>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setIsEditingBio(false);
                                                    setBioText((user as any)?.bio || '');
                                                }}
                                            >
                                                Mégse
                                            </Button>
                                            <Button variant="primary" size="sm" onClick={handleSaveBio} disabled={isSaving}>
                                                {isSaving ? 'Mentés...' : 'Mentés'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-300 whitespace-pre-wrap">
                                    {bioText || 'Még nincs bemutatkozás. Kattints a Szerkesztés gombra!'}
                                </p>
                            )}
                        </div>

                        {/* Stats Card */}
                        <div className="glass-panel p-6 border-l-4 border-green-500">
                            <div className="flex items-center gap-2 mb-4">
                                <Trophy className="w-5 h-5 text-green-500" />
                                <h3 className="text-lg font-display font-bold text-white">Részletes Statisztikák</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-400 uppercase">Harci Képességek</h4>
                                    <div className="flex justify-between p-2 bg-gray-900/50 rounded">
                                        <span className="text-sm text-gray-400">Erő</span>
                                        <span className="text-sm font-bold text-red-400">{user?.stats?.str || 0}</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-gray-900/50 rounded">
                                        <span className="text-sm text-gray-400">Állóképesség</span>
                                        <span className="text-sm font-bold text-green-400">{user?.stats?.tol || 0}</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-gray-900/50 rounded">
                                        <span className="text-sm text-gray-400">Intelligencia</span>
                                        <span className="text-sm font-bold text-blue-400">{user?.stats?.int || 0}</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-gray-900/50 rounded">
                                        <span className="text-sm text-gray-400">Gyorsaság</span>
                                        <span className="text-sm font-bold text-yellow-400">{user?.stats?.spd || 0}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-400 uppercase">Játékadatok</h4>
                                    <div className="flex justify-between p-2 bg-gray-900/50 rounded">
                                        <span className="text-sm text-gray-400">HP</span>
                                        <span className="text-sm font-bold text-success">{user?.hp || 0} / {(user as any)?.maxHp || 100}</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-gray-900/50 rounded">
                                        <span className="text-sm text-gray-400">Bátorság</span>
                                        <span className="text-sm font-bold text-primary">{user?.nerve || 0} / {(user as any)?.maxNerve || 10}</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-gray-900/50 rounded">
                                        <span className="text-sm text-gray-400">Regisztráció</span>
                                        <span className="text-sm font-bold text-gray-300">{registrationDate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right - Settings */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Settings Card */}
                        <div className="glass-panel p-6 border-l-4 border-purple-500 sticky top-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Settings className="w-5 h-5 text-purple-500" />
                                <h3 className="text-lg font-display font-bold text-white">Beállítások</h3>
                            </div>

                            <div className="space-y-4">
                                {/* Sound Toggle */}
                                <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-white">Hangeffektek</span>
                                        <button
                                            onClick={handleToggleSound}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${!isMuted ? 'bg-primary' : 'bg-gray-700'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${!isMuted ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500">{!isMuted ? 'Hangok engedélyezve' : 'Hangok letiltva'}</p>
                                </div>

                                {/* Account Info */}
                                <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm font-medium text-white">Fiók</span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Email: <span className="text-gray-400">{user?.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Logout Card */}
                        <div className="glass-panel p-6 border-l-4 border-red-500">
                            <h3 className="text-lg font-display font-bold text-white mb-4">Veszélyzóna</h3>
                            <Button
                                variant="secondary"
                                onClick={logout}
                                className="w-full border-red-500 text-red-500 hover:bg-red-500/10"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Kijelentkezés
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
