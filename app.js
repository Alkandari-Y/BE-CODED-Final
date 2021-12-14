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
    origin: "http://localhost:19002",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// const users = [];
const activeSockets = [];

io.on("connection", (socket) => {
  console.log("New User Connected: ", socket.id);
  console.log("\n\n");
  activeSockets.push(socket.id);
  console.log("User(s) Connected: ", activeSockets);

  //Creating a list of user and merging/linking socket.id and user._id ---- CANCELED FUNCTION
  // socket.on("authUser", (payload) => {
  //   console.log(payload);
  //   if (payload) {
  //     const foundUser = users.find((user) => user._id === payload._id);
  //     const userSocketExists = users.find(
  //       (user) => socket.id === user.socketId
  //     );
  //     if (!foundUser && !userSocketExists) {
  //       users.push({ _id: payload._id, socketId: socket.id, room: null });
  //     } else if (foundUser && !userSocketExists) {
  //       foundUser.socketId === socket.id;
  //     } else if (!foundUser && userSocketExists) {
  //       userSocketExists._id === payload._id;
  //     }
  //   }
  //   console.log("current array of active sockets", users);
  // });

  //Leave this for uncommented for later (icebox)
  // socket.on("join-group", (payload) => {
  //   console.log("user joined group", socket.id);
  // });

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
