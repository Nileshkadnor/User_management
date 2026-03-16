const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/roleMiddleware");

router.post("/users", userController.createUser);

router.get("/users", auth, userController.getAllUsers);

router.get("/users/:id", auth, userController.getUserById);

router.put("/users/:id", auth, userController.updateUser);

router.delete("/users/:id", auth, isAdmin, userController.deleteUser);

module.exports = router;