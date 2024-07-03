const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    user_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },

}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)