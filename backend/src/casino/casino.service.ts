import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CasinoService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async coinflip(userId: string, amount: number, choice: 'head' | 'tail') {
        if (amount <= 0) {
            throw new BadRequestException('A tétnek pozitívnak kell lennie.');
        }

        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new BadRequestException('Felhasználó nem található.');
        }

        const currentCash = BigInt(user.cash);
        const betAmount = BigInt(amount);

        if (currentCash < betAmount) {
            throw new BadRequestException('Nincs elég pénzed a téthez.');
        }

        const isHead = Math.random() < 0.5;
        const result = isHead ? 'head' : 'tail';
        const won = result === choice;

        let newCash = currentCash;
        if (won) {
            newCash += betAmount; // Win: get bet back + bet amount (profit) = +amount to balance? 
            // Usually in gambling: 
            // You bet 100. Balance -100.
            // If win (2x): You get 200. Net +100.
            // If lose: You get 0. Net -100.
            // Implementation:
            // Option A: Deduct bet first. Then add winnings.
            // Option B: Calculate net change.

            // Let's go with:
            // Win: Balance + Amount
            // Lose: Balance - Amount
        } else {
            newCash -= betAmount;
        }

        user.cash = newCash.toString();
        await this.usersRepository.save(user);

        return {
            won,
            result,
            newBalance: parseInt(user.cash), // Return as number for frontend convenience if safe, or string
        };
    }

    async spin(userId: string, amount: number) {
        if (amount <= 0) {
            throw new BadRequestException('A tétnek pozitívnak kell lennie.');
        }

        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new BadRequestException('Felhasználó nem található.');
        }

        const currentCash = BigInt(user.cash);
        const betAmount = BigInt(amount);

        if (currentCash < betAmount) {
            throw new BadRequestException('Nincs elég pénzed a téthez.');
        }

        // Symbols: 🍒, 🍋, 🔔, 💎, 7️⃣
        const symbols = ['🍒', '🍋', '🔔', '💎', '7️⃣'];
        const reel1 = symbols[Math.floor(Math.random() * symbols.length)];
        const reel2 = symbols[Math.floor(Math.random() * symbols.length)];
        const reel3 = symbols[Math.floor(Math.random() * symbols.length)];

        const resultSymbols = [reel1, reel2, reel3];

        let multiplier = 0;

        // Check winnings
        if (reel1 === '7️⃣' && reel2 === '7️⃣' && reel3 === '7️⃣') {
            multiplier = 50; // Jackpot
        } else if (reel1 === '🍒' && reel2 === '🍒' && reel3 === '🍒') {
            multiplier = 5;
        } else if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
            // 2 same symbols
            multiplier = 1; // Money back
        }

        // Calculate payout
        // If multiplier 0: Lose bet.
        // If multiplier 1: Return bet (no change).
        // If multiplier > 1: Win (bet * multiplier).

        // Logic:
        // Deduct bet first?
        // Let's say bet is 10.
        // Multiplier 0: Balance - 10.
        // Multiplier 1: Balance - 10 + 10 = Balance.
        // Multiplier 5: Balance - 10 + 50 = Balance + 40.

        const winnings = betAmount * BigInt(multiplier);
        const newCash = currentCash - betAmount + winnings;

        user.cash = newCash.toString();
        await this.usersRepository.save(user);

        return {
            symbols: resultSymbols,
            won: multiplier > 0,
            multiplier,
            payout: Number(winnings),
            newBalance: parseInt(user.cash),
        };
    }
}
