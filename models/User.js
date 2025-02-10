const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    isGuest: { type: Boolean, default: false },
    resetToken: String,
    resetTokenExpiry: Date,
});

module.exports = mongoose.model("User", userSchema);
