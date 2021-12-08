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

io.on("connection", (socket) => {
    console.log('user connected', socket.id);
//read js Maps

    socket.on("disconnect", () => {
        console.log('user disconnected', socket.id)
    })
})

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));
