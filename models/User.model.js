const { Schema, model } = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  passwordHash: { type: String, required: true },
  phoneNumber: { type: String, required: true, trim: true },
  role: {
    type: String,
    enum: ["ADMIN", "CONSUMER"],
    required: true,
    default: "CONSUMER",
  },
  address: {
    street: { type: String, required: true, trim: true },
    neighbourhood: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    postCode: { type: String, required: true, trim: true },
    stateOrProvince: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
  },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
