import { IsOptional, IsString, MaxLength, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SettingsDto {
    @IsOptional()
    @IsBoolean()
    soundEnabled?: boolean;
}

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'A bio maximum 500 karakter hosszú lehet.' })
    bio?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => SettingsDto)
    settings?: SettingsDto;
}
