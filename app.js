require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./config/db.config")();

const app = express();

app.use(express.json());
// Não esquecer de criar variável de ambiente com o endereço do seu app React (local ou deployado no Netlify)
app.use(cors({ origin: process.env.REACT_APP_URL }));

//"api" was beign used here before: app.use("/api", userRouter);
const userRouter = require("./routes/user.routes");
app.use("/", userRouter);

const productRouter = require("./routes/product.routes");
app.use("/", productRouter);

const transactionRouter = require("./routes/transaction.routes")
app.use("/", transactionRouter)

app.listen(Number(process.env.PORT), () =>
  console.log(`Server up and running at port ${process.env.PORT}`)
);
