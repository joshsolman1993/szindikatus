import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { UsersModule } from '../users/users.module';
import { ClansModule } from '../clans/clans.module';

@Module({
    imports: [UsersModule, ClansModule],
    controllers: [LeaderboardController],
})
export class LeaderboardModule { }
