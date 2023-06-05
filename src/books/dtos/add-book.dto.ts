import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AddBookDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @ApiProperty({ type: String, description: 'The title of the book.' })
  title: string;

  @IsString()
  @MinLength(3)
  @MaxLength(25)
  @ApiProperty({ type: String, description: 'The author of the book.' })
  author: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: [String],
    description: 'The genre of the book.',
    example: ['fiction', 'fantasy'],
  })
  genre: string[];
}
