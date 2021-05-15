const router = require("express").Router();
const moment = require("moment");
const ProductModel = require("../models/Product.model");
const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");
const isAdmin = require("../middlewares/isAdmin");
const uploadCloud = require("../config/cloudinary.config");

// Image upload to Cloudinary
// 'image' field must have the same name as the name of the requested BODY

router.post(
  "/image-upload",
  isAuthenticated, attachCurrentUser,
  uploadCloud.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(500).json({ msg: "No file uploaded" });
    }

    console.log(req.file);

    return res.status(201).json({ fileUrl: req.file.path });
  }
);

// Crud --> CREATE
router.post(
  "/product",
  isAuthenticated,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
   
    try {
      // if no image, use default image
      if (!req.body.image_url) {
        delete req.body.image_url;
      }

      const result = await ProductModel.create(req.body);

      return res.status(201).json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: JSON.stringify(err) });
    }
  }
);

// cRud --> READ find all
router.get("/product", async (req, res) => {
  try {
    const result = await ProductModel.find();

    console.log(result);

    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ msg: "Product not found." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

// cRud --> READ find one user
router.get("/product/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const result = await ProductModel.findOne({ _id: id })

    if (result.transactions.length) {
      result.populate({
        path: "transactions",
        model: "Transaction",
      });
    }

    console.log(result);

    if (result) {
      return res
        .status(200)
        .json({
          ...result.toObject(),
          expire_date: moment(result.expire_date).format("yyyy-MM-DD"),
        });
    } else {
      return res.status(404).json({ msg: "Product not found." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

// crUd --> UPDATE update one product
router.put(
  "/product/:id",
  isAuthenticated,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
     
      const result = await ProductModel.findOneAndUpdate(
        { _id: id },
        { $set: req.body },
        { new: true }
      );

      console.log(result);

      if (!result) {
        return res.status(404).json({ msg: "Product not found." });
      }

      return res.status(200).json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: JSON.stringify(err) });
    }
  }
);

// cruD --> DELETE delete one product
router.delete(
  "/product/:id",
  isAuthenticated,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await ProductModel.deleteOne({ _id: id });

      if (result.n === 0) {
        return res.status(404).json({ msg: "Product not found." });
      }

      return res.status(200).json({});
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: JSON.stringify(err) });
    }
  }
);

module.exports = router;
