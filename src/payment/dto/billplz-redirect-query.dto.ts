import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

class BillplzObjectDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  paid: string;

  @ApiProperty()
  @IsString()
  paid_at: string;

  @ApiProperty()
  @IsString()
  x_signature: string;
}

export class BillplzRedirectQueryDto {
  @ApiProperty()
  @IsObject()
  billplz: BillplzObjectDto;
}
