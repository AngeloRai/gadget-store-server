const router = require("express").Router();
const TransactionModel = require("../models/Transaction.model");
const UserModel = require("../models/User.model");
const ProductModel = require("../models/Product.model");

const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

const mailer = require("../config/nodemailer.config");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Create a Checkout  Session through Stripe
router.post("/create-checkout-session", isAuthenticated, async (req, res) => {
    // Array para segurar dados dos produtos
  const line_items = [];

  try {
    //Loop through the selected products and creates the required object for Stripe to conclude the transaction
    for (let product of req.body.products) {
      const foundProduct = await ProductModel.findOne({
        _id: product.productId,
      });
      // Verify qtt in stock before confirming transaction
      if (product.qtt > foundProduct.qtt_in_stock) {
        return res.status(403).json({ msg: "Not enough quantity in stock" });
      }

      // This is the required format for the stripe API
      line_items.push({
        price_data: {
          currency: "brl",
          product_data: {
            name: foundProduct.model,
            images: [foundProduct.image_url[0]],
          },
          unit_amount: parseInt(foundProduct.price * 100),
        },
        quantity: product.qtt,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [...line_items],
      mode: "payment",
      success_url: `${process.env.REACT_APP_URL}/order/success`,
      cancel_url: `${process.env.REACT_APP_URL}/order/canceled`,
    });

    return res.status(201).json({ id: session.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Failed to create checkout session." });
  }
});

// Create a new purchase transaction
router.post(
  "/transaction",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      // Generate the transaction
      const result = await TransactionModel.create(req.body);

      // Update the transaction for this user
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: req.body.buyerId },
        { $push: { transactions: result._id } }
      );

      // Update transactions for each product
      const productArr = [];

      for (let product of req.body.products) {
        const updatedProduct = await ProductModel.findOneAndUpdate(
          { _id: product.productId },
          // $inc is an increment operator: it will add or substract the informed qtt
          {
            $push: { transactions: result._id },
            // Atualizar os estoques dos produtos
            $inc: { qtt_in_stock: -product.qtt },
          }
        );

        productArr.push(updatedProduct);
      }

      function renderProduct() {
        let str = ``;
        productArr.map((product) => {
          str += `<li><span>${product.model}</span><br /> <span>${product.price}</span></li>`;
        });

        return str;
      }

      // Send confirmation Email for the purchase
      const emailResponse = await mailer(
        req.currentUser.email,
        "Your order confirmation",
        `<p>Your purchase was received. We\'re waiting for payment confirmation.</p>
        <h3>Gadgets you bought:</h3>
        <ul>
        ${renderProduct()}
        </ul>
        `
      );

      // Sends result to the client
      return res.status(201).json({ result, emailResponse });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: JSON.stringify(err) });
    }
  }
);

// Retrieve transaction details
router.get("/transaction/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Search transaction using the product id from the URL (params)
    const result = await TransactionModel.findOne({ _id: id }).populate({
      path: "products.productId",
      model: "Product",
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

module.exports = router;
