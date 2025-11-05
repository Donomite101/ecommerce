const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Order = require('../models/Order');
const router = express.Router();

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });
    try {
        const decoded = jwt.verify(token, 'secretkey');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
};

router.get('/cart', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate({
            path: 'cart.product',
            select: 'name price image category'
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Filter out cart items with missing products
        const validCartItems = user.cart.filter(item => item.product !== null);
        if (validCartItems.length < user.cart.length) {
            user.cart = validCartItems;
            await user.save();
            console.warn(`Removed ${user.cart.length - validCartItems.length} invalid cart items for user ${req.userId}`);
        }
        res.json({ items: validCartItems });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: `Server error while fetching cart: ${error.message}` });
    }
});

router.post('/cart/add', authMiddleware, async (req, res) => {
    const { productId, quantity } = req.body;
    if (!productId || isNaN(quantity) || quantity < 1) {
        return res.status(400).json({ message: 'Invalid productId or quantity' });
    }
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            user.cart[itemIndex].quantity = parseInt(quantity);
        } else {
            user.cart.push({ product: productId, quantity: parseInt(quantity) });
        }
        await user.save();
        const updatedUser = await User.findById(req.userId).populate({
            path: 'cart.product',
            select: 'name price image category'
        });
        const validCartItems = updatedUser.cart.filter(item => item.product !== null);
        if (validCartItems.length < updatedUser.cart.length) {
            updatedUser.cart = validCartItems;
            await updatedUser.save();
        }
        res.json({ items: validCartItems });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: `Server error while adding to cart: ${error.message}` });
    }
});

router.post('/cart/remove', authMiddleware, async (req, res) => {
    const { productId } = req.body;
    if (!productId) {
        return res.status(400).json({ message: 'Invalid productId' });
    }
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.cart = user.cart.filter(item => item.product.toString() !== productId);
        await user.save();
        const updatedUser = await User.findById(req.userId).populate({
            path: 'cart.product',
            select: 'name price image category'
        });
        const validCartItems = updatedUser.cart.filter(item => item.product !== null);
        res.json({ items: validCartItems });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ message: `Server error while removing from cart: ${error.message}` });
    }
});

router.post('/orders', authMiddleware, async (req, res) => {
    const { address, payment } = req.body;
    if (!address || !payment) {
        return res.status(400).json({ message: 'Address and payment method are required' });
    }
    try {
        const user = await User.findById(req.userId).populate({
            path: 'cart.product',
            select: 'name price image category'
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.cart || user.cart.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }
        const validCartItems = user.cart.filter(item => item.product !== null);
        if (validCartItems.length === 0) {
            return res.status(400).json({ message: 'Cart contains no valid items' });
        }
        const total = validCartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        const order = new Order({
            user: req.userId,
            items: validCartItems,
            total,
            address,
            payment
        });
        await order.save();
        user.cart = [];
        await user.save();
        res.json({ message: 'Order placed' });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: `Server error while placing order: ${error.message}` });
    }
});

router.get('/orders', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId }).populate({
            path: 'items.product',
            select: 'name price image category'
        });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: `Server error while fetching orders: ${error.message}` });
    }
});

module.exports = router;