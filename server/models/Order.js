const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }],
    total: Number,
    address: String,
    payment: String,
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);