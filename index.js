const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const routes = require("./routes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedList = ['http://localhost:3000', 'http://heathervv.com', 'https://heathervv.com'];

const options = {
  origin: function (origin, callback) {
    if (allowedList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}

app.use(cors(options));

app.use(express.json({ type: ['application/json'] }));

app.use("/api", routes);

app.listen(PORT, () => console.log("running"));
