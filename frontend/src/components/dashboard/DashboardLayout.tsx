<div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-4">
        <h1 className="text-xl font-display font-bold text-primary">SZINDIKÁTUS</h1>
        <span className="text-sm text-gray-400">Üdv, {user?.username}!</span>
    </div>
    <Button variant="ghost" size="sm" onClick={logout}>
        <LogOut className="w-4 h-4 mr-2" />
        Kilépés
    </Button>
</div>

{/* Resource Bars */ }
<div className="flex flex-wrap gap-4">
    <ResourceBar
        label="HP"
        current={user?.hp || 0}
        max={user?.maxHp || 100}
        color="success"
        icon={<Heart className="w-4 h-4 text-success" />}
    />
    <ResourceBar
        label="Energia"
        current={user?.energy || 0}
        max={user?.maxEnergy || 100}
        color="secondary"
        icon={<Zap className="w-4 h-4 text-secondary" />}
    />
    <ResourceBar
        label="Bátorság"
        current={user?.nerve || 0}
        max={user?.maxNerve || 10}
        color="primary"
        icon={<Shield className="w-4 h-4 text-primary" />}
    />
</div>
                </div >
            </div >

    <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-800 bg-surface/30 p-4 hidden md:block">
            <nav className="space-y-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-primary text-white'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-6xl mx-auto">
                {children}
            </div>
        </main>
    </div>
        </div >
    );
};
