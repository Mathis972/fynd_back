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
app.use("/reponses",require('./routes/reponses'))
app.use("/reponses_utilisateurs",require('./routes/reponses_utilisateurs'))
app.use("/raisons_inscriptions",require('./routes/raisons_inscriptions'))
app.use("/photos_utilisateurs",require('./routes/photos_utilisateurs'))
app.use("/liaisons_raisons_inscriptions",require('./routes/liaisons_raisons_inscriptions'))

 const arrayRoom = ['room1','room2','room3']
io.on('connection', (socket) =>{
  const room = arrayRoom[Math.floor(Math.random() * 3)]
  console.log(room)

  socket.username = 'anonymous';
  socket.join(room);
  //console.log(socket.rooms);
  socket.on('idLaunch',(msg) => {
  socket.emit('id',socket.id);
  })
  socket.emit('id',socket.id);
  socket.on('message', (msg) =>{
    io.to(room).emit('message', msg);
    console.log('message: ' + msg);
  })
  const clients2 = io.sockets.adapter.rooms.get(room);
  const clients = io.sockets.adapter.rooms.get(room).size;
   console.log(clients)
   console.log(clients2)

//Limiter les rooms en nombres d'utilisateurs

if (clients === 1){
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
