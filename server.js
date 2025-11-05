require('dotenv').config(); // Load .env variables

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const authRoutes = require('./server/routes/auth');
const productRoutes = require('./server/routes/products');
const orderRoutes = require('./server/routes/orders');
const { connectDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3009;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api', orderRoutes);

connectDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
