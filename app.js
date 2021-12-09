require("dotenv").config();
const path = require("path");
const express = require("express");
const http = require('http');
const { Server } = require("socket.io");

const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./database");
const { errorHandler } = require("./middleware/errorHandler");

const passport = require("passport");
const { localStrategy, JWTStrategy } = require("./middleware/passport");

const app = express();
connectDB();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use("/media/", express.static(path.join(__dirname, "media")));

//PASSPORT
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(JWTStrategy);

//Route Imports
const userRoutes = require("./apis/users/routes");
const groupRoutes = require("./apis/groups/routes");

//Routes
app.use("/api/", userRoutes);
app.use("/api/groups", groupRoutes);

app.use(errorHandler);

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:19002",
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
})

const users = []

io.on("connection", (socket) => {
    socket.on('authUser', (payload) => {
        // console.log('authuser', payload, 'socket id: ', socket.id);
        if (payload) {
            const foundUser = users.find(user => user._id === payload._id);
            if (!foundUser) {
                users.push({ _id: payload._id, socketId: socket.id, room: null });
            } else if (foundUser && payload._id) {
                foundUser.socketId === socket.id
            }
        } else {
            users.filter(user => user.socketId === socket.id)
        }
        console.log('current array', users)
    });

    socket.on('join-group', (payload) => {
        console.log('user joined group', socket.id)
    })

    socket.on('group-message', (payload) => {
        console.log(payload);
        users.forEach(user => {
            console.log(`sent message`)
            io.to(user.socketId).emit('new-message', (payload))
        })
        console.log(`end of transmission! message`)
    })

    socket.on("disconnect", () => {
        console.log('user disconnected', socket.id)
        users.filter(user => socket.id === user.socketid)

        console.log('disconnect array', users)
        
    });


})

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));
