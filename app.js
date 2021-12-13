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

const users = [];

io.on("connection", (socket) => {
  console.log("New User Connected: ", socket.id);
  console.log("\n\n\n\n\n\n\n");

  //Creating a list of user and merging/linking socket.id and user._id
  socket.on("authUser", (payload) => {
    console.log(payload);
    if (payload) {
      const foundUser = users.find((user) => user._id === payload._id);
      const userSocketExists = users.find(
        (user) => socket.id === user.socketId
      );
      if (!foundUser && !userSocketExists) {
        users.push({ _id: payload._id, socketId: socket.id, room: null });
      } else if (foundUser && !userSocketExists) {
        foundUser.socketId === socket.id;
      } else if (!foundUser && userSocketExists) {
        userSocketExists._id === payload._id;
      }
    }
    console.log("current array of active sockets", users);
  });

  //Leave this for uncommented for later (icebox)
  // socket.on("join-group", (payload) => {
  //   console.log("user joined group", socket.id);
  // });

  //send group message
  socket.on("group-message", (payload) => {
    console.log(payload);
    const recipients = users.filter(
      (user) => user._id !== payload.response.sentFrom
    );
    recipients.forEach((recipient) => {
      io.to(recipient.socketId).emit("new-message", payload);
    });
    console.log(`end of transmission! message`);
  });

  //create new group
  socket.on("new-group", (payload) => {
    console.log(payload);

    const recipients = users.filter((user) => user._id !== payload.owner);

    recipients.forEach((recipient) => {
      io.to(recipient.socketId).emit("group-list-update", payload);
      console.log(`Sent updated group list to: ${socket.id}`);
    });
  });

  //add-user-to-group
  socket.on("adding-new-member", (payload) => {
    console.log(payload);

    // const recipients = users.filter((user) => user._id !== payload.owner);
    const recipients = users.filter(
      (user) => payload.members.includes(user._id) && user._id !== payload.owner
    );
    console.log("deliver to: ", recipients);
    recipients.forEach((recipient) => {
      io.to(recipient.socketId).emit("receive-new-member", payload);
      console.log(`Sent updated group and member list to: ${socket.id}`);
    });
  });

  //create poll
  socket.on("create-poll", (data) => {
    console.log(data);
    const recipients = users.filter((user) => user._id !== data.owner);
    recipients.forEach((recipient) => {
      io.to(recipient.socketId).emit("recieve-poll", data);
      console.log("recipients BE:", recipient.socketId);
    });
  });

  //poll-vote
  socket.on("submit-poll-vote", (data) => {
    const recipients = users.filter((user) => user.socketId !== socket.id);
    recipients.forEach((recipient) => {
      io.to(recipient.socketId).emit("recieve-poll-vote", data);
      console.log("data in BE:", data);
      console.log("recipients BE:", recipient.socketId);
    });
  });

  //delete-group
  //leave-group
  //edit-profile
  //edit-group

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    users.filter((user) => socket.id === user.socketId);

    console.log("disconnect array", users);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));
