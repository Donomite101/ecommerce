const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

router.get('/', async (req, res) => {
    console.log('Fetching products');
    const products = await Product.find();
    res.json(products);
});

router.post('/add', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
});

module.exports = router;