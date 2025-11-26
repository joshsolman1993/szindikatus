import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { TALENTS, TalentId } from './talents.constants';

@Injectable()
export class TalentsService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    getTalents() {
        return Object.values(TALENTS);
    }

    async learnTalent(userId: string, talentId: TalentId) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new BadRequestException('User not found');
        }

        const talent = TALENTS[talentId];
        if (!talent) {
            throw new BadRequestException('Invalid talent ID');
        }

        // Initialize learnedTalents if null (should be default [] but just in case)
        if (!user.learnedTalents) {
            user.learnedTalents = [];
        }

        if (user.learnedTalents.includes(talentId)) {
            throw new BadRequestException('Talent already learned');
        }

        if (user.talentPoints < 1) {
            throw new BadRequestException('Not enough talent points');
        }

        if (user.level < talent.requiredLevel) {
            throw new BadRequestException(`Level ${talent.requiredLevel} required`);
        }

        if (talent.requiredTalentId && !user.learnedTalents.includes(talent.requiredTalentId)) {
            const requiredTalent = TALENTS[talent.requiredTalentId];
            throw new BadRequestException(`Requires ${requiredTalent.name}`);
        }

        user.talentPoints -= 1;
        user.learnedTalents.push(talentId);

        await this.usersRepository.save(user);
        return { success: true, learnedTalents: user.learnedTalents, talentPoints: user.talentPoints };
    }
}
