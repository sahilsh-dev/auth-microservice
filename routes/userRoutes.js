const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.post(
  "/register",
  [
    check("username", "Username is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
    check("fullName", "Full name is required").not().isEmpty(),
    check("gender", "Gender is required").not().isEmpty(),
    check("dateOfBirth", "Valid date of birth is required").isISO8601(),
    check("country", "Country is required").not().isEmpty(),
  ],
  userController.registerUser,
);

router.post(
  "/login",
  [
    check("identifier", "Username or email is required").not().isEmpty(),
    check("password", "Password is required").exists(),
  ],
  userController.loginUser,
);

router.get("/users/search", auth, userController.searchUser);

module.exports = router;
