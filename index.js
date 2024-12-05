import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./Routes/index.js";

const allowedOrigins = ["http://localhost:3001"];

dotenv.config();

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to Database successfully!");
} catch (error) {
  console.error("Couldn't connect to Database: " + error.message);
  process.exit(1);
}

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.error(`Error occurred: ${err.message}`);
  } else {
    console.log(`Server is running on port ${process.env.PORT}`);
  }
});
