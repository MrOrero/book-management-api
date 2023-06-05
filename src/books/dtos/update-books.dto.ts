import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateBookDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'The title of the book.',
    required: false,
  })
  title: string;

  @IsString()
  @MinLength(3)
  @MaxLength(25)
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'The author of the book.',
    required: false,
  })
  author: string;

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    type: [String],
    description: 'The genre of the book.',
    example: ['fiction', 'fantasy'],
    required: false,
  })
  genre: string[];
}
