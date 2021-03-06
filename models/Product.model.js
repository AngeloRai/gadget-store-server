const { Schema, model } = require("mongoose");

const ProductSchema = new Schema({
  category: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true, maxlength: 38 },
  brand: { type: String, required: true, trim: true },
  cost: { type: Number, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  description: { type: String, maxlength: 500 },
  color: { type: String, required: true },
  condition: { type: String, enum: ["NEW", "USED"], required: true },
  image_url: [{ type: String, default: "https://res.cloudinary.com/angeloraimondi/image/upload/v1621089570/gadget-store/file_i13ib0.png" }],
  qtt_in_stock: { type: Number, required: true, default: 1 },
  transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
});

const ProductModel = model("Product", ProductSchema);

module.exports = ProductModel;
