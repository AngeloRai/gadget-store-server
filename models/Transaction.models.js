const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  // ref é um atributo especial que aponta para o modelo que está criando um relacionamento com este modelo
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [
    new mongoose.Schema(
      {
        qtt: Number,
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      },
      { _id: false }
    ),
  ],
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", TransactionSchema);
