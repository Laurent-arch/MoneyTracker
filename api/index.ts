import { createServer, Server } from "http";
import * as express from "express";
const cors = require("cors");
import * as dotenv from "dotenv";
import mongoose from "mongoose";
const Transaction = require("./models/Transaction");

dotenv.config();
mongoose.set("strictQuery", false);

const app: express.Express = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const server: Server = createServer(app);

app.post("/api/transaction", async (req, res) => {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    return res
      .status(400)
      .send("MONGO_URL environment variable is not defined");
  }

  await mongoose.connect(mongoUrl);
  const { name, price, description, datetime } = req.body;

  const transaction = await Transaction.create({
    name,
    description,
    datetime,
    price
  });
  
  console.log(transaction);
})

app.get('/api/transactions', async (req, res) => {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
      return res
        .status(400)
        .send("MONGO_URL environment variable is not defined");
    }

    await mongoose.connect(mongoUrl);
    const transactions = await Transaction.find();
    res.json(transactions);
})

const port: number = 4040;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
