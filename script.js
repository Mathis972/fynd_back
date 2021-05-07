const express = require("express");
var bodyParser = require('body-parser')
const cors = require('cors');
const app = express()
var server = app.listen(8000);
const io = require('socket.io')(server,{
  allowEIO3: true,
  cors: {
    origin: '*',
  }})
app.use(express.json())
app.use(cors());


const port = process.env.PORT || 8000;

app.use("/utilisateurs",require('./routes/utilisateurs'))
app.use("/conversations",require('./routes/conversations'))
app.use("/messages",require('./routes/messages'))
app.use("/questions",require('./routes/questions'))
app.use("/reponses_utilisateurs",require('./routes/reponses_utilisateurs'))
app.use("/raisons_inscriptions",require('./routes/raisons_inscriptions'))
app.use("/photos_utilisateurs",require('./routes/photos_utilisateurs'))
app.use("/liaisons_raisons_inscriptions",require('./routes/liaisons_raisons_inscriptions'))

io.on('connection', (socket) =>{

  socket.on('message', (msg) =>{
    io.emit('message', msg);
    console.log('message: ' + msg);
  })
  console.log(`Connecté au client ${socket.id}`)
})
