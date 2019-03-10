const express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var cors = require('cors');
const app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);

var dbUrl = 'mongodb+srv://judomat:mongo@cluster0-4sqly.mongodb.net/test?retryWrites=true'
mongoose.connect(dbUrl , (err) => { 
  console.log('mongodb connected', err)
})
var Message = mongoose.model('Message', { name : String, message : String})

app.use(cors()); 
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.get('/messages', (req, res) => {
  console.log("get")
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})

app.post('/messages', (req, res) => {
  console.log('post')
  var message = new Message(req.body);
  message.save((err) =>{
    if(err)
      sendStatus(500);
    io.emit('message', req.body);
    res.sendStatus(200);
  })
})

io.on('connection', function(socket) {
  console.log('Client connected.');
  socket.on('disconnect', function() {
      console.log('Client disconnected.');
  });
});

 var server = http.listen(3000, () => {
  console.log('server is running on port', server.address().port);
});

