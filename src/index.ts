import app from './app'

const port = 3000

//AQUI SE PUEDEN AGREGAR RUTAS

app.get('/', function(req, res) {
  res.send('hello world');
});


app.listen(port, (err) => {
  if (err) {
    return console.log(err)
  }

  return console.log(`server is listening on http://localhost:${port}`)
})
