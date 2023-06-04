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
  title: string;

  @IsString()
  @MinLength(3)
  @MaxLength(25)
  author: string;

  @IsArray()
  genre: string[];
}
