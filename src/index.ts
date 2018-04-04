//Se importa todo lo necesario para correr la API
  import App from './app'
  import * as mongodb from 'mongodb'
  import { BookRepo } from './repositories/book.repo';
  import { GenreRepo } from './repositories/genre.repo';
  import { AuthorRepo } from './repositories/author.repo';
  import { Db, MongoClient } from 'mongodb';
  import { Author, Book, Genre } from './models/library';

//Creamos el objeto api, que representará la API RESTful
  const api = new App();

//Para poder hacer llamadas asíncronas, creamos una funcion run
const run = async () =>{

  //Creamos la conexión con la BDD correspondiente
  const mc = await MongoClient.connect('mongodb://localhost:27017/library');
  const mongo: Db = mc.db('library');
  const db = {
    Authors: mongo.collection<Author>('authors'),
    Books: mongo.collection<Book>('books'),
    Genres: mongo.collection<Genre>('genres')
  }

  //Creamos los objetos que representan los repositorios de datos
    const authors = new AuthorRepo(db);
    const books = new BookRepo(db);
    const genres = new GenreRepo(db);
  //Puerto a usar para servir el backend de forma local
    const port = 3000;

  //Se declaran las rutas que se van a utilizar en la API
    api.express.route('/api/books')
      .post(async function(req, res){
        if(req.body.title 
          && req.body.edition
          && req.body.year){
            let book: Book;
            if(req.body.links){
              book =  {
                title: req.body.title,
                edition: req.body.edition,
                year: req.body.year,
                links: req.body.links
              };
            }
            else{
              book =  {
                title: req.body.title,
                edition: req.body.edition,
                year: req.body.year,
                links: req.body.links
              };
            }
            let result = await books.create(book);
            res.status(201).json({
              message: 'Libro creado',
              book: result
            });
          }
        else{
          res.status(422).json({message:'Missing parameters'});
        } 
      })
      .get(async function(req, res){
        let result = await books.getAll();
        res.status(200).json({
          message: 'Libros buscados',
          books: result
        });
      });

      api.express.route('/api/books/:book_id')
      .put(async function(req, res){
        if(!req.body.title 
          && !req.body.edition
          && !req.body.year
          && !req.body.links){
            res.status(422).json({message:'Missing parameters'});
          }
        else{
          let old: Book = await books.get(req.params.book_id);
          if(req.body.links){
            req.body.links.authors = typeof req.body.links.authors !== "undefined" ? req.body.links.authors : old.links.authors;
            req.body.links.genres = typeof req.body.links.genres !== "undefined" ? req.body.links.genres : old.links.genres;
            req.body.links.year = typeof req.body.links.year !== "undefined" ? req.body.links.year : old.links.year;
          }
          let book: Book = {
            title: typeof req.body.title !== "undefined" ? req.body.title : old.title,
            edition: typeof req.body.edition !== "undefined" ? req.body.edition : old.edition,
            year: typeof req.body.year !== "undefined" ? req.body.year : old.year,
            links: typeof req.body.links !== "undefined" ? req.body.links : old.links
          };
          let result = await books.update(req.params.book_id, book);
          res.status(200).json({
            message: 'Libro actualizado',
            book: result
          });
        } 
      })
      .get(async function(req, res){
        let result = await books.get(req.params.book_id);
        res.status(200).json({
          message: 'Libro buscado',
          books: result
        });
      })

      .delete(async function(req, res){
        let result = await books.remove(req.params.book_id);
        res.status(200).json({
          message: 'Libro borrado',
          books: result
        });
      });


  //Se inicia la aplicación, para que corra en el puerto provisto
    api.express.listen(port, (err) => {
      if (err) {
        return console.log(err)
      }

      return console.log(`server is listening on http://localhost:${port}`)
    });
}

run();

