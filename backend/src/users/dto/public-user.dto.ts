export class PublicUserDto {
    id: string;
    username: string;
    avatarUrl: string;
    totalStats: number; // Összes statisztika összege (erő becslés)

    constructor(user: any) {
        this.id = user.id;
        this.username = user.username;
        // DiceBear API avatar generálás
        this.avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.username)}&backgroundColor=1f2937`;
        // Összes stat összege
        const stats = user.stats || { str: 0, tol: 0, int: 0, spd: 0 };
        this.totalStats = stats.str + stats.tol + stats.int + stats.spd;
    }
}
