import express from "express";

const app = express();
const PORT = 8080;
app.use(express.json());

const server = app.listen(PORT, (err) => {
  if (err) {
    console.error(`Error occurred: ${err.message}`);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use`);
  } else {
    console.error(`Error occurred: ${error.message}`);
  }
});
