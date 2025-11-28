export class PublicUserDto {
  id: string;
  username: string;
  avatarUrl: string;
  totalStats: number; // Összes statisztika összege (erő becslés)
  clanTag?: string;
  xp?: number;
  cash?: string;

  constructor(user: any, computedStats?: any) {
    this.id = user.id;
    this.username = user.username;
    // DiceBear API avatar generálás
    this.avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.username)}&backgroundColor=1f2937`;
    // Összes stat összege
    if (computedStats) {
      this.totalStats =
        computedStats.totalStr +
        computedStats.totalTol +
        computedStats.totalInt +
        computedStats.totalSpd;
    } else {
      const stats = user.stats || { str: 0, tol: 0, int: 0, spd: 0 };
      this.totalStats = stats.str + stats.tol + stats.int + stats.spd;
    }

    if (user.clan) {
      this.clanTag = user.clan.tag;
    }

    // XP és cash hozzáadása
    this.xp = user.xp;
    this.cash = user.cash;
  }
}
