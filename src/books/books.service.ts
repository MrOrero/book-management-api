import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './books.entity';
import { Repository } from 'typeorm';
import { AddBookDto } from './dtos/add-book.dto';

@Injectable()
export class BooksService {
  constructor(@InjectRepository(Book) private repo: Repository<Book>) {}

  getBooks() {
    return this.repo.find();
  }

  getBook(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOneBy({ id });
  }

  addBook(book: AddBookDto) {
    const newBook = this.repo.create(book);

    return this.repo.save(newBook);
  }

  async updateBook(id: number, book: Partial<AddBookDto>) {
    const foundBook = await this.getBook(id);

    if (!foundBook) {
      return null;
    }

    await this.repo.update({ id }, book);

    return this.getBook(id);
  }

  async deleteBook(id: number) {
    const foundBook = await this.getBook(id);

    if (!foundBook) {
      return null;
    }

    return this.repo.delete({ id });
  }
}
