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
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { BooksService } from './books.service';
import { AddBookDto } from './dtos/add-book.dto';
import { UpdateBookDto } from './dtos/update-books.dto';

@ApiTags('Books')
@Controller('api/books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiOperation({
    summary: 'Retrieve all books',
    description: 'Get a list of all books.',
  })
  @ApiOkResponse({ description: 'Books retrieved successfully' })
  @ApiNotFoundResponse({ description: 'No books found' })
  @Get()
  async getBooks() {
    const books = await this.booksService.getBooks();

    if (!books.length) {
      throw new NotFoundException('No books found');
    }

    return books;
  }

  @ApiOperation({
    summary: 'Retrieve a specific book',
    description: 'Get a specific book by its ID.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the book.' })
  @ApiOkResponse({ description: 'Book retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Book not found' })
  @Get(':id')
  async getBook(@Param('id') id: string) {
    const book = await this.booksService.getBook(+id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  @ApiOperation({
    summary: 'Add a new book',
    description: 'Add a new book to the collection.',
  })
  @ApiOkResponse({ description: 'Book added successfully' })
  @ApiBody({ type: AddBookDto })
  @Post()
  async addBook(@Body() body: AddBookDto) {
    return await this.booksService.addBook(body);
  }

  @ApiOperation({
    summary: 'Update an existing book',
    description: 'Update an existing book in the collection.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the book.' })
  @ApiOkResponse({ description: 'Book updated successfully' })
  @ApiNotFoundResponse({ description: 'Book not found' })
  @ApiBody({ type: UpdateBookDto })
  @Put(':id')
  async updateBook(@Param('id') id: string, @Body() body: UpdateBookDto) {
    const book = await this.booksService.updateBook(+id, body);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  @ApiOperation({
    summary: 'Delete a book',
    description: 'Delete a book from the collection.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the book.' })
  @ApiOkResponse({ description: 'Book deleted successfully' })
  @ApiNotFoundResponse({ description: 'Book not found' })
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
