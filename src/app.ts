import * as express from 'express'

class App {
  public express

  constructor () {
    this.express = express()
  }


}

export default new App().express