import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'

export default class App {
  public express;
  public router;

  constructor () {
    //Se declara express, que manejara la comunicación HTTP
    this.express = express();

    // Se utiliza BodyParser() para poder recibir data de los POSTS

      //Para recibir data del tipo application/x-www-form-urlencoded
      this.express.use(bodyParser.urlencoded({ extended: true }));

      //Para recibir data del tipo application/json
      this.express.use(bodyParser.json());

      this.express.use(cors());
  }


}