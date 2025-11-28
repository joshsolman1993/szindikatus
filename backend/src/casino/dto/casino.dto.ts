import { IsNumber, IsString, IsIn, Min } from 'class-validator';

export class CoinflipDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  @IsIn(['head', 'tail'])
  choice: 'head' | 'tail';
}

export class SpinDto {
  @IsNumber()
  @Min(1)
  amount: number;
}
