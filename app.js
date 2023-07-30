require("dotenv").config();
const path = require("path");
const express = require("express");
const http = require("http");
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
const pollRoutes = require("./apis/polls/routes");

//Routes
app.use("/api/", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/polls", pollRoutes);

app.use(errorHandler);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const activeSockets = [];

io.on("connection", (socket) => {
  console.log("New User Connected: ", socket.id);
  console.log("\n\n");
  activeSockets.push(socket.id);
  console.log("User(s) Connected: ", activeSockets);

  //send group message
  socket.on("group-message", (payload) => {
    socket.broadcast.emit("new-message", payload);
  });

  //create new group
  socket.on("new-group", (payload) => {
    socket.broadcast.emit("group-list-update", payload);
  });

  //add-user-to-group
  socket.on("adding-new-member", (payload) => {
    socket.broadcast.emit("receive-new-member", payload);
  });

  //TBD - delete-group
  socket.on("delete-group", (data) => {
    socket.broadcast.emit("navigate-home");
    socket.broadcast.emit("recieve-deleted-group", data);
  });

  //edit-group
  socket.on("edit-group", (data) => {
    socket.broadcast.emit("recieve-edited-group", data);
  });

  //TBD - leave-group
  socket.on("leave-group", (data) => {
    socket.broadcast.emit("recieve-left-group", data);
  });

  //create poll
  socket.on("create-poll", (data) => {
    socket.broadcast.emit("recieve-poll", data);
  });

  //poll-vote
  socket.on("submit-poll-vote", (data) => {
    socket.broadcast.emit("receive-poll-vote", data);
  });

  // Push-new-user-profile
  socket.on("pushNewUserProfile", (data) => {
    socket.broadcast.emit("recieve-new-user-profile", data);
  });

  //edit-profile
  socket.on("update-profile", (data) => {
    socket.broadcast.emit("recieve-updated-profile", data);
  });

  //register-user .... MAYBE NOT?!

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));
