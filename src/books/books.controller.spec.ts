import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

describe('BooksController', () => {
  let booksController: BooksController;
  let mockBooksService: Partial<BooksService>;

  beforeEach(async () => {
    mockBooksService = {
      getBooks: jest.fn(),
      getBook: jest.fn(),
      addBook: jest.fn(),
      updateBook: jest.fn(),
      deleteBook: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    booksController = module.get<BooksController>(BooksController);
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
      (mockBooksService.getBooks as jest.Mock).mockResolvedValueOnce(mockBooks);

      const result = await booksController.getBooks();

      expect(result).toEqual(mockBooks);
      expect(mockBooksService.getBooks).toHaveBeenCalled();
    });

    it('should throw NotFoundException if no books are found', async () => {
      (mockBooksService.getBooks as jest.Mock).mockResolvedValueOnce([]);

      await expect(booksController.getBooks()).rejects.toThrowError(
        NotFoundException,
      );
      expect(mockBooksService.getBooks).toHaveBeenCalled();
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
      (mockBooksService.getBook as jest.Mock).mockResolvedValueOnce(mockBook);

      const result = await booksController.getBook('1');

      expect(result).toEqual(mockBook);
      expect(mockBooksService.getBook).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if book is not found', async () => {
      (mockBooksService.getBook as jest.Mock).mockResolvedValueOnce(null);

      await expect(booksController.getBook('1')).rejects.toThrowError(
        NotFoundException,
      );
      expect(mockBooksService.getBook).toHaveBeenCalledWith(1);
    });
  });

  describe('addBook', () => {
    it('should add a new book', async () => {
      const newBook = {
        title: 'New Book',
        author: 'Author',
        genre: ['war', 'love'],
      };
      const savedBook = {
        id: 1,
        title: 'New Book',
        author: 'Author',
        genre: ['war', 'love'],
      };
      (mockBooksService.addBook as jest.Mock).mockResolvedValueOnce(savedBook);

      const result = await booksController.addBook(newBook);

      expect(result).toEqual(savedBook);
      expect(mockBooksService.addBook).toHaveBeenCalledWith(newBook);
    });
  });

  describe('updateBook', () => {
    it('should update an existing book', async () => {
      const updatedBook = {
        title: 'Updated Book',
        author: 'Author',
        genre: ['war', 'love'],
      };
      const mockBook = {
        id: 1,
        title: 'Book 1',
        author: 'Orero Ozore',
        genre: ['war', 'love'],
      };
      const updatedMockBook = {
        id: 1,
        title: 'Updated Book',
        author: 'Author',
        genre: ['war', 'love'],
      };
      (mockBooksService.getBook as jest.Mock).mockResolvedValueOnce(mockBook);
      (mockBooksService.updateBook as jest.Mock).mockResolvedValueOnce(
        updatedMockBook,
      );

      const result = await booksController.updateBook('1', updatedBook);

      expect(result).toEqual(updatedMockBook);
      expect(mockBooksService.updateBook).toHaveBeenCalledWith(1, updatedBook);
    });

    it('should throw NotFoundException if book is not found', async () => {
      const updatedBook = {
        title: 'Updated Book',
        author: 'Author',
        genre: ['war', 'love'],
      };
      (mockBooksService.getBook as jest.Mock).mockResolvedValueOnce(null);

      await expect(
        booksController.updateBook('1', updatedBook),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('deleteBook', () => {
    it('should delete a book', async () => {
      (mockBooksService.getBook as jest.Mock).mockResolvedValueOnce({
        id: 1,
        title: 'Book 1',
        author: 'Orero Ozore',
        genre: ['war', 'love'],
      });
      (mockBooksService.deleteBook as jest.Mock).mockResolvedValueOnce(true);

      const result = await booksController.deleteBook('1');

      expect(result).toEqual({ message: 'Book deleted successfully' });
      expect(mockBooksService.deleteBook).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if book is not found', async () => {
      (mockBooksService.getBook as jest.Mock).mockResolvedValueOnce(null);

      await expect(booksController.deleteBook('1')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
