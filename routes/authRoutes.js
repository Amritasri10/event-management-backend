const express = require("express");
const { registerUser, loginUser, guestLogin, logoutUser, getUserProfile, updateUserProfile} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/guest", guestLogin);
router.get("/logout", logoutUser);
router.get("/profile", protect,getUserProfile);
router.put("/profile", protect, updateUserProfile);



module.exports = router;
