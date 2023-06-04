import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './books.entity';
import { AddBookDto } from './dtos/add-book.dto';

describe('BooksService', () => {
  let booksService: BooksService;
  let bookRepository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useClass: Repository,
        },
      ],
    }).compile();

    booksService = module.get<BooksService>(BooksService);
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  describe('getBooks', () => {
    it('should return an array of books', async () => {
      const mockBooks = [
        {
          id: 1,
          title: 'Book 1',
          author: 'Orero Ozore',
          genre: ['war', 'love'],
        },
        {
          id: 2,
          title: 'Book 2',
          author: 'Orero Ozore',
          genre: ['war', 'love'],
        },
      ];
      jest.spyOn(bookRepository, 'find').mockResolvedValueOnce(mockBooks);

      const result = await booksService.getBooks();

      expect(bookRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockBooks);
    });
  });

  describe('getBook', () => {
    it('should return a book with the given ID', async () => {
      const mockBook = {
        id: 1,
        title: 'Book 1',
        author: 'Orero Ozore',
        genre: ['war', 'love'],
      };
      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(mockBook);

      const result = await booksService.getBook(1);

      expect(bookRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockBook);
    });

    it('should return null if no ID is provided', async () => {
      const result = await booksService.getBook(null);

      expect(result).toBeNull();
    });
  });

  describe('addBook', () => {
    it('should add a new book', async () => {
      const newBook: AddBookDto = {
        title: 'New Book',
        author: 'Author',
        genre: ['romance'],
      };
      const savedBook = { id: 1, ...newBook };
      jest.spyOn(bookRepository, 'create').mockReturnValueOnce(newBook as Book);
      jest.spyOn(bookRepository, 'save').mockResolvedValueOnce(savedBook);

      const result = await booksService.addBook(newBook);

      expect(bookRepository.create).toHaveBeenCalledWith(newBook);
      expect(result).toEqual(savedBook);
    });
  });

  describe('updateBook', () => {
    it('should update a book', async () => {
      const updatedBook: Partial<AddBookDto> = { title: 'Updated Book' };
      const foundBook = {
        id: 1,
        title: 'Book 1',
        author: 'Author',
        genre: ['horror'],
      };
      jest.spyOn(booksService, 'getBook').mockResolvedValueOnce(foundBook);
      jest.spyOn(bookRepository, 'update').mockResolvedValueOnce({
        affected: 1,
        raw: [updatedBook],
        generatedMaps: [updatedBook],
      });
      jest
        .spyOn(booksService, 'getBook')
        .mockResolvedValueOnce({ id: 1, ...foundBook, ...updatedBook });

      const result = await booksService.updateBook(1, updatedBook);

      expect(booksService.getBook).toHaveBeenCalledWith(foundBook.id);
      expect(result).toEqual({ id: 1, ...foundBook, ...updatedBook });
    });

    it('should return null if book is not found', async () => {
      jest.spyOn(booksService, 'getBook').mockResolvedValueOnce(null);

      const result = await booksService.updateBook(1, {});

      expect(result).toBeNull();
    });
  });

  describe('deleteBook', () => {
    it('should delete a book', async () => {
      const foundBook = {
        id: 1,
        title: 'Book 1',
        author: 'Author',
        genre: ['action'],
      };
      jest.spyOn(booksService, 'getBook').mockResolvedValueOnce(foundBook);
      jest
        .spyOn(bookRepository, 'delete')
        .mockResolvedValueOnce({ affected: 1, raw: [] });

      const result = await booksService.deleteBook(1);

      expect(booksService.getBook).toHaveBeenCalledWith(foundBook.id);
      expect(bookRepository.delete).toHaveBeenCalledWith({ id: foundBook.id });
    });

    it('should return null if book is not found', async () => {
      jest.spyOn(booksService, 'getBook').mockResolvedValueOnce(null);

      const result = await booksService.deleteBook(1);

      expect(result).toBeNull();
    });
  });
});
