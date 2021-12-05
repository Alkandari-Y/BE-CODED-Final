require("dotenv").config();
const path = require("path");
const express = require("express");

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

//Routes
app.use("/api/", userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));
