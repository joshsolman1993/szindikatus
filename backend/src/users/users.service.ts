import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from '../auth/dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(registerDto: RegisterDto): Promise<User> {
        const { username, email, password } = registerDto;

        // Jelszó hashelése
        const salt = await bcrypt.genSalt();
        const password_hash = await bcrypt.hash(password, salt);

        const user = this.usersRepository.create({
            username,
            email,
            password_hash,
        });

        try {
            return await this.usersRepository.save(user);
        } catch (error) {
            // Postgres error code 23505 is unique_violation
            if (error.code === '23505') {
                throw new ConflictException('Ez az email cím vagy felhasználónév már foglalt.');
            }
            throw new InternalServerErrorException();
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }
}
