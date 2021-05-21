const router = require("express").Router();
const bcrypt = require("bcryptjs");

const UserModel = require("../models/User.model");
const generateToken = require("../config/jwt.config");
const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

const salt_rounds = 10;

// Crud (CREATE) - HTTP POST
// Create a new USER
router.post("/signup", async (req, res) => {
  // Requisições do tipo POST tem uma propriedade especial chamada body, que carrega a informação enviada pelo cliente

  try {
    // Assign incoming password from body request
    const { password } = req.body;

    // Cheeck if passwaord secure enough 
    if (
      !password ||
      !password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
      )
    ) {
      // 400 Bad Request
      return res.status(400).json({
        msg: "Password is required and must have at least 8 characters, uppercase and lowercase letters, numbers and special characters.",
      });
    }

    // Generate salt to add to the hashed password
    const salt = await bcrypt.genSalt(salt_rounds);

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, salt);

    // Store data into the database (MongoDB) using body request as parameter 
    const result = await UserModel.create({
      ...req.body,
      passwordHash: hashedPassword,
    });

    // Respond client side with created user. Stauts 201: Created
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    // 500 Internal Server Error
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    // Extract email and password from body request
    const { email, password } = req.body;

    // Search user in the database by email
    const user = await UserModel.findOne({ email });

    // If user is not found, user is not registered 
    if (!user) {
      return res
        .status(400)
        .json({ msg: "This email is not yet registered in our website;" });
    }

    // Verify if password matches with incoming password from the form

    if (await bcrypt.compare(password, user.passwordHash)) {
      // Generate JWT token with the logged user data
      const token = generateToken(user);

      return res.status(200).json({
        user: {
          name: user.name,
          email: user.email,
          _id: user._id,
          role: user.role,
        },
        token,
      });
    } else {
      // 401 Unauthorized
      return res.status(401).json({ msg: "Wrong password or email" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

// cRud (READ) - HTTP GET
// Search user data
router.get("/profile", isAuthenticated, attachCurrentUser, (req, res) => {

  try {
    // Search logged user which is made available through the attachCurrentUser middleware
    const loggedInUser = req.currentUser;

    if (loggedInUser) {
      // Respond client side with user data. Stauts 201: Created
      return res.status(200).json(loggedInUser);
    } else {
      return res.status(404).json({ msg: "User not found." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

// crUd (UPDATE) - HTTP PUT/PATCH
// Update user data
router.put("/user/:id", async (req, res) => {
  try {
    // Extract id from route parameter
    const { id } = req.params;

    // Update specific user data in the database
    const result = await UserModel.findOneAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true }
    );

    // If user not found in database, return 404
    if (!result) {
      return res.status(404).json({ msg: "User not found." });
    }

    // Respond with user updated user to the client side
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

// cruD (DELETE) - HTTP DELETE
// Deletar um usuário
router.delete("/user/:id", async (req, res) => {
  try {
    // Extrair o id do usuário do parâmetro de rota
    const { id } = req.params;

    // Delete user from database
    const result = await UserModel.deleteOne({ _id: id });

    // Caso a busca não tenha encontrado resultados, retorne 404
    if (result.n === 0) {
      return res.status(404).json({ msg: "User not found." });
    }

    // Por convenção, em deleções retornamos um objeto vazio para descrever sucesso
    return res.status(200).json({});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

module.exports = router;
