import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/books (GET)', () => {
    it('should return an array of books', () => {
      return request(app.getHttpServer())
        .get('/books')
        .expect(200)
        .expect((response) => {
          expect(Array.isArray(response.body)).toBeTruthy();
          expect(response.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('/books/:id (GET)', () => {
    it('should return a specific book', () => {
      const bookId = 4;

      return request(app.getHttpServer())
        .get(`/books/${bookId}`)
        .expect(200)
        .expect((response) => {
          expect(response.body.id).toBe(bookId);
          expect(response.body.title).toBeDefined();
          expect(response.body.author).toBeDefined();
        });
    });

    it('should return 404 if the book is not found', () => {
      const nonExistingBookId = 999;

      return request(app.getHttpServer())
        .get(`/books/${nonExistingBookId}`)
        .expect(404);
    });
  });

  describe('/books (POST)', () => {
    it('should create a new book', () => {
      const newBook = {
        title: 'New Book',
        author: 'John Doe',
        genre: ['fiction'],
      };

      return request(app.getHttpServer())
        .post('/books')
        .send(newBook)
        .expect(201)
        .expect((response) => {
          expect(response.body.id).toBeDefined();
          expect(response.body.title).toBe(newBook.title);
          expect(response.body.author).toBe(newBook.author);
        });
    });
  });

  describe('/books/:id (PUT)', () => {
    it('should update an existing book', async () => {
      const bookId = 6;
      const updatedBook = {
        title: 'Updated Book',
        author: 'Jane Smith',
        genre: ['fiction', 'mystery'],
      };

      return request(app.getHttpServer())
        .put(`/books/${bookId}`)
        .send(updatedBook)
        .expect(200)
        .expect((response) => {
          expect(response.body.id).toBe(bookId);
          expect(response.body.title).toBe(updatedBook.title);
          expect(response.body.author).toBe(updatedBook.author);
        });
    });

    it('should return 404 if the book to update is not found', async () => {
      const nonExistingBookId = 999;
      const updatedBook = {
        title: 'Updated Book',
        author: 'Jane Smith',
        genre: ['fiction', 'mystery'],
      };

      return request(app.getHttpServer())
        .put(`/books/${nonExistingBookId}`)
        .send(updatedBook)
        .expect(404);
    });
  });

  describe('/books/:id (DELETE)', () => {
    it('should delete a specific book', async () => {
      const bookId = 7;

      return request(app.getHttpServer())
        .delete(`/books/${bookId}`)
        .expect(200)
        .expect((response) => {
          expect(response.body.message).toBe('Book deleted successfully');
        });
    });

    it('should return 404 if the book to delete is not found', async () => {
      const nonExistingBookId = 999;

      return request(app.getHttpServer())
        .delete(`/books/${nonExistingBookId}`)
        .expect(404);
    });
  });
});
