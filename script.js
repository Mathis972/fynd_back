const express = require("express");
var bodyParser = require('body-parser')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 8000;
var server = app.listen(port);
const io = require('socket.io')(server, {
  allowEIO3: true,
  cors: {
    origin: '*',
  }
})
app.use(express.json())
app.use(cors());


app.use("/utilisateurs", require('./routes/utilisateurs'))
app.use("/conversations", require('./routes/conversations'))
app.use("/messages", require('./routes/messages'))
app.use("/questions", require('./routes/questions'))
app.use("/reponses", require('./routes/reponses'))
app.use("/reponses_utilisateurs", require('./routes/reponses_utilisateurs'))
app.use("/raisons_inscriptions", require('./routes/raisons_inscriptions'))
app.use("/photos_utilisateurs", require('./routes/photos_utilisateurs'))
app.use("/liaisons_raisons_inscriptions", require('./routes/liaisons_raisons_inscriptions'))

const arrayRoom = 'room3'
let id_user = ''
io.on('connection', (socket) => {
  let room = arrayRoom

  //console.log(socket.rooms);
  socket.on('idLaunch', function (msg) {
    id_user = msg
    console.log(id_user)
    socket.join(room);
    const clients2 = io.sockets.adapter.rooms.get(room);
    const clients = io.sockets.adapter.rooms.get(room).size;

    console.log(clients2)
    if (clients === 1) {
      socket.join(room);
    } else if (clients === 2) {
      socket.join(room);
    } else { // max two clients
      console.log("tes la")
      socket.disconnect()
      console.log(clients2)
    }
    console.log(`Connecté à la room  ${room}`)
  })
  socket.on('message', (msg) => {
    console.log('jjj' + id_user)
    io.to(room).emit('message', msg);
    console.log('message: ' + msg);
  })
  socket.on('joinRoom', (data) => {
    socket.leave(room);
    const clients1 = io.sockets.adapter.rooms.get(room);
    console.log(clients1)
    console.log(data)
    room = data
    socket.join(room)
    const clients2 = io.sockets.adapter.rooms.get(room);
    console.log(clients2)
  })
  //socket.emit('id',socket.id);
  // socket.on('message', (msg) =>{
  //   console.log('jjj'+ id_user)
  //   io.to(room).emit('message', msg);
  //   console.log('message: ' + msg);
  // })
  // const clients2 = io.sockets.adapter.rooms.get(room);
  // const clients = io.sockets.adapter.rooms.get(room).size;
  // console.log(clients)
  // console.log(clients2)

  //Limiter les rooms en nombres d'utilisateurs

  // if (clients === 1){
  //   socket.join(room);
  // } else if (clients === 2) {
  //   socket.join(room);
  // } else { // max two clients
  //   console.log("tes la")
  //   socket.disconnect()
  //   console.log(clients2)
  // }
  //   console.log(`Connecté à la room  ${room}`)

})

// je recupere le id de l'utilisateur
// Création d'une conversation si il n'y a pas l'utilisateur dans une conversation
// ajoute l'utilisateur à la conversation