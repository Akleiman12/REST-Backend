//Se importa todo lo necesario para correr la API
  import App from './app'
  import * as mongodb from 'mongodb'
  import { BookRepo } from './repositories/book.repo';
  import { GenreRepo } from './repositories/genre.repo';
  import { AuthorRepo } from './repositories/author.repo';
  import { Db, MongoClient } from 'mongodb';
  import { Author, Book, Genre } from './models/library';
  import * as mcache from 'memory-cache';

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
    const port = 3001;
  
  //Creamos la función que será utilizada de middleware para manejar el caché en la aplicación
    
    /* La función se llama cache y recibe una duración
    * (que es el tiempo en segundos que se mantendrá en 
    * el caché del servidor la respuesta)
    */
    const cache = (duration) =>{
      //Se recibe el requerimiento, la respuesta y la función next, propias de express
      return (req, res, next) =>{
        //Se reconstruye el request que llega a la API en la variable key
        //Este request representa un endpoint
        let key = '__express__'+req.originalUrl || req.url;
        
        //Se obtiene del caché del servidor, si existe, la respuesta a dicho request
        let cachedBody = mcache.get(key);

        //Si existe, se manda directamente sin tener que interactuar directamente con el backend
        if(cachedBody){
          console.log("Uso de caché");
          res.send(cachedBody);
          return
        }
        /* Si no, se agarra la función de respuesta y se le obliga a, 
        * antes de enviar la respuesta al frontend, guardar el cuerpo
        * de la respuesta en caché con la duración especificada y 
        * luego sí seguir la respuesta al frontend
        */

        else{
          res.sendResponse = res.send;
          res.send = (body) =>{
            console.log("Guardado en caché");
            mcache.put(key, body, duration * 1000);
            res.sendResponse(body);
          }
          next();
        }
      }
    }
  //Se declaran las rutas que se van a utilizar en la API
    //Rutas relacionadas con todos los libros
      api.express.route('/api/books')
        .post(async function(req, res){ //Operador para crear un libro

          //Si la data que se manda tiene todas las propiedades de un libro, se procede
          if(req.body.title 
            && req.body.edition
            && req.body.year){
              let book: Book;
              //Si se enviaron además los links relevantes para el libro, se incluyen
              if(req.body.links){
                book =  {
                  title: req.body.title,
                  edition: req.body.edition,
                  year: req.body.year,
                  links: req.body.links
                };
              }
              //Sino, no se incluyen
              else{
                book =  {
                  title: req.body.title,
                  edition: req.body.edition,
                  year: req.body.year,
                  links: req.body.links
                };
              }
              //Se crea el libro en la base de datos respectiva
              let result = await books.create(book);

              //Una vez lista la creación, se envía el libro creado devuelta
              res.status(201).json({
                message: 'Libro creado',
                book: result
              });
            }
          //Si no se tiene la data necesaria para crear un libro, se envía un mensaje de error
          else{
            res.status(422).json({message:'Missing parameters'});
          } 
        })
        .get(cache(15), async function(req, res){ //Operador para retornar todos los libros disponibles
          
          //Se pide a la base de datos todos los libros disponibles
          let result = await books.getAll();

          //Una vez lista la búsqueda, se envían los libros conseguidos devuelta
          res.status(200).json({
            message: 'Libros buscados',
            books: result
          });
        });


    //Rutas relacionadas con un libro en particular
      api.express.route('/api/books/:book_id')
        .put(async function(req, res){ //Operador para actualizar un libro
          //Si no se tiene ningún campo disponible con el que actualizar, se retorna un mensaje de error
          if(!req.body.title 
            && !req.body.edition
            && !req.body.year
            && !req.body.links){
              res.status(422).json({message:'Missing parameters'});
          }
          //Si no, se puede proseguir
          else{
            //Se busca el libro a actualizar, para encontrar las diferencias
            let old: Book = await books.get(req.params.book_id);
            
            //Se construye el libro con las características viejas y las características nuevas
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

            //Con el libro actualizado en una variable, se inserta en la base de datos
            let result = await books.update(req.params.book_id, book);

            //Se envía el libro actualizado
            res.status(200).json({
              message: 'Libro actualizado',
              book: result
            });
<<<<<<< HEAD
          }
        else{
          res.status(422).json({message:'Missing parameters'});
        } 
      })
      .get(async function(req, res){
        console.log('entre peeeerrroooooooo')
          let result = await books.getAll();
          res.status(200).json({
            message: 'Libros buscados',
            books: result
          });
      });
=======
          } 
        })
        .get(cache(15), async function(req, res){ //Operador para buscar un libro específico

          //Se busca en la base de datos el libro especificado
          let result = await books.get(req.params.book_id);

          //Se retorna el libro que fue buscado
          res.status(200).json({
            message: 'Libro buscado',
            books: result
          });
        })

        .delete(async function(req, res){ //Operador para eliminar un libro específico

          //Se busca y elimina en la base de datos el libro especificado
          let result = await books.remove(req.params.book_id);

          //Se retorna el libro que fue borrado
          res.status(200).json({
            message: 'Libro borrado',
            books: result
          });
        });
      //Rutas relacionadas con todos los autores
        api.express.route('/api/authors')
        .post(async function(req, res){ //Operador para crear un autor
          //Si la data que se manda tiene todas las propiedades de un autor, se procede
          if(req.body.given_name 
            && req.body.middle_name
            && req.body.last_name
            && req.body.birth_date
            && req.body.birth_place
            && req.body.death_date
            && req.body.death_place
            && req.body.age
            ){
              let author: Author;
              //Si se enviaron además los links relevantes para el autor, se incluyen
              if(req.body.links){
                author =  {
                  given_name: req.body.given_name,
                  middle_name: req.body.middle_name,
                  last_name: req.body.last_name,
                  birth_date: req.body.birth_date,
                  birth_place: req.body.birth_place,
                  death_date: req.body.death_date,
                  death_place: req.body.death_place,
                  age: req.body.age,
                  links: req.body.links
                };
              }
              //Sino, no se incluyen
              else{
                author =  {
                  given_name: req.body.given_name,
                  middle_name: req.body.middle_name,
                  last_name: req.body.last_name,
                  birth_date: req.body.birth_date,
                  birth_place: req.body.birth_place,
                  death_date: req.body.death_date,
                  death_place: req.body.death_place,
                  age: req.body.age
                };
              }
>>>>>>> 660fd4ccad32a639e827fc1e1b5cea536ef6e29b

              //Se crea el autor en la base de datos respectiva
              let result = await authors.create(author);

              //Una vez lista la creación, se envía el autor creado devuelta
              res.status(201).json({
                message: 'Autor creado',
                author: result
              });
          }
          //Si no se tiene la data necesaria para crear un autor, se envía un mensaje de error
          else{
            res.status(422).json({message:'Missing parameters'});
          } 
        })
        .get(cache(15), async function(req, res){ //Operador para retornar todos los autores disponibles
          
          //Se pide a la base de datos todos los autores disponibles
          let result = await authors.getAll();

          //Una vez lista la búsqueda, se envían los autores conseguidos devuelta
          res.status(200).json({
            message: 'Autores buscados',
            authors: result
          });
        });


      //Rutas relacionadas con un autor en particular
        api.express.route('/api/authors/:author_id')
        .put(async function(req, res){ //Operador para actualizar un autor
          //Si no se tiene ningún campo disponible con el que actualizar, se retorna un mensaje de error
          if(!req.body.given_name 
            && !req.body.middle_name
            && !req.body.last_name
            && !req.body.birth_date
            && !req.body.birth_place
            && !req.body.death_date
            && !req.body.death_place
            && !req.body.age
            && !req.body.links){
              res.status(422).json({message:'Missing parameters'});
          }
          //Si no, se puede proseguir
          else{
            //Se busca el autor a actualizar, para encontrar las diferencias
            let old: Author = await authors.get(req.params.author_id);

            //Se construye el autor con las características viejas y las características nuevas
            if(req.body.links){
              req.body.links.books = typeof req.body.links.books !== "undefined" ? req.body.links.books : old.links.books;
              req.body.links.genres = typeof req.body.links.genres !== "undefined" ? req.body.links.genres : old.links.genres;
            }
            let author: Author = {
              given_name: typeof req.body.given_name !== "undefined" ? req.body.given_name : old.given_name,
              middle_name: typeof req.body.middle_name !== "undefined" ? req.body.middle_name : old.middle_name,
              last_name: typeof req.body.last_name !== "undefined" ? req.body.last_name : old.last_name,
              birth_date: typeof req.body.birth_date !== "undefined" ? req.body.birth_date : old.birth_date,
              birth_place: typeof req.body.birth_place !== "undefined" ? req.body.birth_place : old.birth_place,
              death_date: typeof req.body.death_date !== "undefined" ? req.body.death_date : old.death_date,
              death_place: typeof req.body.death_place !== "undefined" ? req.body.death_place : old.death_place,
              age: typeof req.body.age !== "undefined" ? req.body.age : old.age,
              links: typeof req.body.links !== "undefined" ? req.body.links : old.links
            };

            //Con el autor actualizado en una variable, se inserta en la base de datos
            let result = await authors.update(req.params.author_id, author);

            //Se envía el autor actualizado
            res.status(200).json({
              message: 'Autor actualizado',
              author: result
            });
          } 
        })
        .get(cache(15), async function(req, res){ //Operador para buscar un autor específico

          //Se busca en la base de datos el autor especificado
          let result = await authors.get(req.params.author_id);

          //Se retorna el autor que fue buscado
          res.status(200).json({
            message: 'Autor buscado',
            authors: result
          });
        })

        .delete(async function(req, res){ //Operador para eliminar un autor específico

          //Se busca y elimina en la base de datos el autor especificado
          let result = await authors.remove(req.params.author_id);

          //Se retorna el autor que fue borrado
          res.status(200).json({
            message: 'Autor borrado',
            authors: result
          });
        });

      //Rutas relacionadas con todos los géneros
        api.express.route('/api/genres')
        .post(async function(req, res){ //Operador para crear un género
          //Si la data que se manda tiene todas las propiedades de un género, se procede
          if(req.body.title){
              let genre: Genre;
              //Si se enviaron además los links relevantes para el género, se incluyen
              if(req.body.links){
                genre =  {
                  title: req.body.title,
                  links: req.body.links
                };
              }
              //Sino, no se incluyen
              else{
                genre =  {
                  title: req.body.title
                };
              }

              //Se crea el género en la base de datos respectiva
              let result = await genres.create(genre);

              //Una vez lista la creación, se envía el género creado devuelta
              res.status(201).json({
                message: 'Género creado',
                genre: result
              });
          }
          //Si no se tiene la data necesaria para crear un género, se envía un mensaje de error
          else{
            res.status(422).json({message:'Missing parameters'});
          } 
        })
        .get(cache(15), async function(req, res){ //Operador para retornar todos los géneros disponibles
          
          //Se pide a la base de datos todos los géneros disponibles
          let result = await genres.getAll();

          //Una vez lista la búsqueda, se envían los géneros conseguidos devuelta
          res.status(200).json({
            message: 'Géneros buscados',
            genres: result
          });
        });


      //Rutas relacionadas con un género en particular 
        api.express.route('/api/genres/:genre_id')
        .put(async function(req, res){ //Operador para actualizar un género
          //Si no se tiene ningún campo disponible con el que actualizar, se retorna un mensaje de error
          if(!req.body.title
            && !req.body.links){
              res.status(422).json({message:'Missing parameters'});
            }
          //Si no, se puede proseguir
          else{
            //Se busca el género a actualizar, para encontrar las diferencias
            let old: Genre = await genres.get(req.params.genre_id);

            //Se construye el género con las características viejas y las características nuevas
            if(req.body.links){
              req.body.links.books = typeof req.body.links.books !== "undefined" ? req.body.links.books : old.links.books;
              req.body.links.authors = typeof req.body.links.authors !== "undefined" ? req.body.links.authors : old.links.authors;
            }
            let genre: Genre = {
              title: typeof req.body.title !== "undefined" ? req.body.title : old.title,
              links: typeof req.body.links !== "undefined" ? req.body.links : old.links
            };

            //Con el género actualizado en una variable, se inserta en la base de datos
            let result = await genres.update(req.params.genre_id, genre);

            //Se envía el género actualizado
            res.status(200).json({
              message: 'Género actualizado',
              genre: result
            });
          } 
        })
        .get(cache(15), async function(req, res){ //Operador para buscar un género específico
          
          //Se busca en la base de datos el género especificado
          let result = await genres.get(req.params.genre_id);

          //Se retorna el género que fue buscado
          res.status(200).json({
            message: 'Género buscado',
            genres: result
          });
        })

        .delete(async function(req, res){ //Operador para eliminar un género específico

          //Se busca y elimina en la base de datos el género especificado
          let result = await genres.remove(req.params.genre_id);

          //Se retorna el género que fue borrado
          res.status(200).json({
            message: 'Género borrado',
            genres: result
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

