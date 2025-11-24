
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Shield, Zap, DollarSign } from 'lucide-react';

export const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className="border-b border-gray-800 bg-background/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="text-2xl font-display font-bold text-primary tracking-wider">
                            SZINDIKÁTUS
                        </div>
                        <div className="flex gap-4">
                            <Link to="/login">
                                <Button variant="ghost">Bejelentkezés</Button>
                            </Link>
                            <Link to="/register">
                                <Button>Regisztráció</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <main className="flex-grow">
                <div className="relative isolate px-6 pt-14 lg:px-8">
                    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-display mb-6">
                            Urald az <span className="text-primary">Árnyékvilágot</span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-400">
                            Építsd ki a birodalmad, küzdj meg más játékosokkal, és válj a város rettegett urává ebben a cyberpunk gengszter szimulátorban.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link to="/register">
                                <Button size="lg" className="shadow-lg shadow-primary/20">
                                    Csatlakozom a Szindikátushoz
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="outline" size="lg">
                                    Már tag vagyok
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="py-24 bg-surface/30">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-6 p-4 bg-primary/10 rounded-full text-primary">
                                    <Zap size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Energia és Bátorság</h3>
                                <p className="text-gray-400">Gazdálkodj okosan az erőforrásaiddal. Minden döntés számít.</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-6 p-4 bg-secondary/10 rounded-full text-secondary">
                                    <DollarSign size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Gazdaság</h3>
                                <p className="text-gray-400">Szerezz pénzt bűntényekkel, és fektesd be felszerelésbe.</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-6 p-4 bg-success/10 rounded-full text-success">
                                    <Shield size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Hatalom</h3>
                                <p className="text-gray-400">Növeld a statisztikáidat és domináld a ranglistát.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
