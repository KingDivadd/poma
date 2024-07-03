const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const bodyParser = require('body-parser')
const connectDB = require('./config/db')
const cors = require('cors')
require('dotenv').config()
require('colors')
const session = require('express-session')
const notFoundMiddleWare = require("./middleware/not-found-middleware")
const errorHandlerMiddleWare = require("./middleware/error-handler-middleware")
const index = require('./routes/index')
    // const passport = require('passport')

const app = express()
const server = http.createServer(app)


app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// socket
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`A user connected`.yellow.bold)

    socket.on("send_chat_text", async(data, callback) => {
        socket.broadcast.emit("sending text", data)
    })
});


// Routes
app.use("/api/v1", index)


// Errors
app.use(notFoundMiddleWare)


// running the app
const start = async() => {
    const PORT = process.env.PORT || 5500
    try {
        await connectDB()
        server.listen(PORT, console.log(`DriveIt SERVER started andd running on PORT ${PORT}`.cyan.bold))
    } catch (err) {
        console.log('something went wrong'.red.bold, err)
    }
}
start()