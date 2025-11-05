const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true, enum: ['men', 'women', 'kids'] }
});

module.exports = mongoose.model('Product', productSchema);