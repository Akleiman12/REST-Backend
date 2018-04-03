//Se importa todo lo necesario para correr la API
  import App from './app'
  import * as mongodb from 'mongodb'

//Creamos el objeto api, que representará la API RESTful
  const api = new App();

//Creamos la variable db, que representa la base de datos a usar
  const db = mongodb;

//Puerto a usar para servir el backend de forma local
  const port = 3000;

//Se declaran las rutas que se van a utilizar en la API
  api.router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
  });

/*Se registran las rutas de la API, encontradas en el router,
 bajo un prefijo específico*/
  api.express.use('/api', api.router);

//Se inicia la aplicación, para que corra en el puerto provisto
  api.express.listen(port, (err) => {
    if (err) {
      return console.log(err)
    }

    return console.log(`server is listening on http://localhost:${port}`)
  });
