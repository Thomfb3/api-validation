process.env.NODE_ENV = 'test';

const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Book = require("../models/book");


describe("Book Routes Test", function () {

    beforeEach(async function () {
        await db.query(`DELETE FROM books`);
        await Book.create(
            {
                "isbn": "06911614573443",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Some Guy",
                "language": "english",
                "pages": 123,
                "publisher": "Princeton University Press",
                "title": "Bird-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
            }
        );

        await Book.create(
            {
                "isbn": "06911614768939",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Other Guy",
                "language": "english",
                "pages": 123,
                "publisher": "Princeton University Press",
                "title": "Bird-Up 2: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
            }
        );
    });




    /** GET / all books */
    describe("GET /books", () => {
        test("Get a list of all books", async () => {
            const res = await request(app).get('/books');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                books: [
                    {
                        "isbn": "06911614768939",
                        "amazon_url": "http://a.co/eobPtX2",
                        "author": "Other Guy",
                        "language": "english",
                        "pages": 123,
                        "publisher": "Princeton University Press",
                        "title": "Bird-Up 2: Unlocking the Hidden Mathematics in Video Games",
                        "year": 2017
                    },
                    {
                        "isbn": "06911614573443",
                        "amazon_url": "http://a.co/eobPtX2",
                        "author": "Some Guy",
                        "language": "english",
                        "pages": 123,
                        "publisher": "Princeton University Press",
                        "title": "Bird-Up: Unlocking the Hidden Mathematics in Video Games",
                        "year": 2017
                    }
                ]
            });
        });
    });


    /** GET / one books */
    describe("GET /books/isbn", () => {
        test("Get one book by isbn", async () => {
            const res = await request(app).get('/books/06911614573443');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                book: {
                    "isbn": "06911614573443",
                    "amazon_url": "http://a.co/eobPtX2",
                    "author": "Some Guy",
                    "language": "english",
                    "pages": 123,
                    "publisher": "Princeton University Press",
                    "title": "Bird-Up: Unlocking the Hidden Mathematics in Video Games",
                    "year": 2017
                }
            });
        });
    });



    /** POST / one book */
    describe("POST /books", () => {
        test("Post one book by isbn", async () => {

            let b1 = {
                "isbn": "06911634567890",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Some Guy",
                "language": "english",
                "pages": 123,
                "publisher": "Princeton University Press",
                "title": "Bird-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
            };

            const res = await request(app).post('/books').send(b1)
            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual({ book: b1 });
        });
    });


        /** POST / Error wrong schema */
        describe("POST /books", () => {
            test("Post one book by isbn", async () => {
    
                let b1 = {
                    "isbn": "06911634567890",
                    "amazon_url": "http://a.co/eobPtX2",
                    "author": ["Some Guy"],
                    "language": "english",
                    "pages": 123,
                    "publisher": "Princeton University Press",
                    "title": "Bird-Up: Unlocking the Hidden Mathematics in Video Games",
                    "year": 2017
                };
    
                const res = await request(app).post('/books').send(b1)
                expect(res.statusCode).toBe(400);
            });
        });
    



    /** PUT / one book */
    describe("PUT /books", () => {
        test("PUT one book by isbn", async () => {

            const res = await request(app).put('/books/06911614573443').send({
                "isbn": "06911614573443",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Some other Guy",
                "language": "english",
                "pages": 12345,
                "publisher": "Princeton University Press",
                "title": "Bird-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2019
            });
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                book: {
                    "isbn": "06911614573443",
                    "amazon_url": "http://a.co/eobPtX2",
                    "author": "Some other Guy",
                    "language": "english",
                    "pages": 12345,
                    "publisher": "Princeton University Press",
                    "title": "Bird-Up: Unlocking the Hidden Mathematics in Video Games",
                    "year": 2019
                }
            });
        });
    });


        /** PUT / Error wrong schema */
        describe("PUT /books", () => {
            test("PUT one book by isbn", async () => {
    
                const res = await request(app).put('/books/06911614573443').send({
                    "isbn": "06911614573443",
                    "amazon_url": "http://a.co/eobPtX2",
                    "author": "Some other Guy",
                    "language": "english",
                    "pages": "12345",
                    "publisher": "Princeton University Press",
                    "title": "Bird-Up: Unlocking the Hidden Mathematics in Video Games",
                    "year": 2019
                });
                expect(res.statusCode).toBe(400);
            });
        });

    afterAll(async function () {
        await db.end();
    });


});