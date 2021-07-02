const express = require("express");
var bodyParser = require('body-parser')
const cors = require('cors');
const app = express()
// const fileUpload = require('express-fileupload')
path = require('path')
//app.use(fileUpload())

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
app.use(express.static(path.join(__dirname, 'public')));

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
  let room = ''

  //console.log(socket.rooms);
  socket.on('idLaunch', function (msg) {
    id_user = msg
    console.log(id_user)
    socket.join(room);
    const clients2 = io.sockets.adapter.rooms.get(room);
    const clients = io.sockets.adapter.rooms.get(room).size;

    // console.log(clients2)
    // if (clients === 1) {
    //   socket.join(room);
    // } else if (clients === 2) {
    //   socket.join(room);
    // } else { // max two clients
    //   console.log("tes la")
    //   socket.disconnect()
    //   console.log(clients2)
    // }
    console.log(`Connecté à la room  ${room}`)
  })
  socket.on('message', (msg) => {
    console.log('message' + room)
    socket.on('notification', (data) => {
      console.log(data)
      socket.to(room).emit('notification', data, room)
    })
    io.to(room).emit('message', msg, room);
  })
  socket.on('modal', (data) => {
    io.to(room).emit('modal', data);
  })
  socket.on('joinRoom', (data) => {
    room = data
    console.log('join' + room)
    socket.join(room)
  })

})

// je recupere le id de l'utilisateur
// Création d'une conversation si il n'y a pas l'utilisateur dans une conversation
// ajoute l'utilisateur à la conversation