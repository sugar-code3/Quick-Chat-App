const express = require('express');
const cors = require('cors')
const app = express();
const authRouter = require('./controllers/authController');
const userRouter = require('./controllers/userController');
const chatRouter = require('./controllers/chatController');
const messageRouter = require('./controllers/messageController');

//use auth controller routers
app.use(cors());
app.use(express.json({
    limit: "50mb"
}))
const server = require('http').createServer(app);


// use socket.io 
// create a socket.io server and pass the http server to it
// and set the CORS options to allow requests from the client
// socket.io server will listen to the same port as the http server
// and will handle the socket connections
// socket.io server will emit events to the client when a user sends a message
// and will listen to events from the client when a user joins a room or sends a message
// socket.io server will also handle the online users and emit events to the client when a user logs in or goes offline
// and will handle the online users and emit events to the client when a user logs in or goes offline

const io = require('socket.io')(server, {cors: {
    origin: `${process.env.CLIENT_URL || 'http://localhost:3000'}`,
    credentials: true,
    methods: ['GET', 'POST']
}})  

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);

const onlineUser = [];

//TEST SOCKET CONNECTION FROM CLIENT
// socket.io server will listen to the connection event and will handle the socket connections

io.on('connection', socket => {
    socket.on('join-room', userid => {
        socket.join(userid);
    })

    socket.on('send-message', (message) => {
        io
        .to(message.members[0])
        .to(message.members[1])
        .emit('receive-message', message)

        io
        .to(message.members[0])
        .to(message.members[1])
        .emit('set-message-count', message)
    })

    socket.on('clear-unread-messages', data => {
        io
        .to(data.members[0])
        .to(data.members[1])
        .emit('message-count-cleared', data)
    })

    socket.on('user-typing', (data) => {
        io
        .to(data.members[0])
        .to(data.members[1])
        .emit('started-typing', data)
    })

    socket.on('user-login', userId => {
        if(!onlineUser.includes(userId)){
            onlineUser.push(userId)
        }
        socket.emit('online-users', onlineUser);
    })

    socket.on('user-offline', userId => {
        onlineUser.splice(onlineUser.indexOf(userId), 1);
        io.emit('online-users-updated', onlineUser);
    })
})

module.exports = server;
