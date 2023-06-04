import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { AddBookDto } from './dtos/add-book.dto';
import { UpdateBookDto } from './dtos/update-books.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // Retrieve all books
  @Get()
  async getBooks() {
    const books = await this.booksService.getBooks();

    if (!books.length) {
      throw new NotFoundException('No books found');
    }

    return books;
  }

  // Retrieve a specific book
  @Get(':id')
  async getBook(@Param('id') id: string) {
    const book = await this.booksService.getBook(+id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  // Add a new book
  @Post()
  async addBook(@Body() body: AddBookDto) {
    return await this.booksService.addBook(body);
  }

  // Update an existing book
  @Put(':id')
  async updateBook(@Param('id') id: string, @Body() body: UpdateBookDto) {
    const book = await this.booksService.updateBook(+id, body);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  // Delete a book
  @Delete(':id')
  async deleteBook(@Param('id') id: string) {
    const deleted = await this.booksService.deleteBook(+id);

    if (!deleted) {
      throw new NotFoundException('Book not found');
    }

    return {
      message: 'Book deleted successfully',
    };
  }
}
