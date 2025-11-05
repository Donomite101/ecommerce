const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    cart: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }],
    sessionToken: String // Optional: store token for server-side validation
});

module.exports = mongoose.model('User', userSchema);