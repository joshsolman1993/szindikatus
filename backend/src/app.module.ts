import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CrimesModule } from './crimes/crimes.module';
import { CommonModule } from './common/common.module';
import { FightModule } from './fight/fight.module';
import { ItemsModule } from './items/items.module';
import { MarketModule } from './market/market.module';
import { InventoryModule } from './inventory/inventory.module';
import { ChatModule } from './chat/chat.module';
import { ClansModule } from './clans/clans.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { CasinoModule } from './casino/casino.module';
import { PropertiesModule } from './properties/properties.module';
import { TalentsModule } from './talents/talents.module';
import { EventsModule } from './events/events.module';
import { TerritoriesModule } from './territories/territories.module';
import { MissionsModule } from './missions/missions.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '../.env',
            isGlobal: true,
        }),
        ScheduleModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_DATABASE'),
                entities: [User],
                synchronize: true,
                autoLoadEntities: true,
            }),
            inject: [ConfigService],
        }),
        UsersModule,
        AuthModule,
        CrimesModule,
        CommonModule,
        FightModule,
        ItemsModule,
        MarketModule,
        InventoryModule,
        ChatModule,
        ClansModule,
        LeaderboardModule,
        CasinoModule,
        PropertiesModule,
        TalentsModule,
        EventsModule,
        TerritoriesModule,
        MissionsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }

