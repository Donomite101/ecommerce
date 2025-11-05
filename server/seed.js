const mongoose = require('mongoose');
const Product = require('./models/Product');
const { connectDB } = require('../db');
require('dotenv').config({ path: __dirname + '/../.env' }); // 👈 Load .env from root


async function seedProducts() {
    try {
        await connectDB();
        console.log('Connected to MongoDB');

        const products = [
        {
            name: "Men's Naruto T-Shirt",
            price: 29.99,
            image: "https://m.media-amazon.com/images/I/71USu2Mf4eL._SY879_.jpg",
            category: "men"
        },
        {
            name: "Men's Japanese Manga Print",
            price: 59.99,
            image: "https://m.media-amazon.com/images/I/41F2okw0CkL.jpg",
            category: "men"
        },
        {
            name: "Men's Anime Luffy Gear 5 Graphic",
            price: 49.99,
            image: "https://m.media-amazon.com/images/I/81hymK+bqBL._SX679_.jpg",
            category: "men"
        },

        {
            name: "Women's Demon Slayer T-Shirt",
            price: 39.99,
            image: "https://m.media-amazon.com/images/I/51%20CMSYUrNL._AC_UY1000_.jpg",
            category: "women"
        },
        {
            name: "Women's Tokyo Ghoul Jacket",
            price: 79.99,
            image: "https://m.media-amazon.com/images/I/51%20CMSYUrNL._AC_UY1000_.jpg",
            category: "women"
        },
        {
            name: "Women's Otaku T-Shirt",
            price: 29.99,
            image: "https://images-cdn.ubuy.co.in/6864370e7dec04b9720635aa-anime-girl-japanese-aesthetic-anime.jpg",
            category: "women"
        },

        {
            name: "Kids' Pokémon T-Shirt",
            price: 14.99,
            image: "https://dragonball.store/wp-content/uploads/2022/07/Autumn-Sweatshirt-Fashion-Goku-Clothes-Dragon-Ball-Z-Hoodies-Kids-Hoodies-Anime-Boys-Girls-Tops-Children-1.jpg_640x640-1.jpg",
            category: "kids"
        },
        {
            name: "Kids' Dragon Ball Hoodie",
            price: 24.99,
            image: "https://dragonball.store/wp-content/uploads/2022/07/Autumn-Sweatshirt-Fashion-Goku-Clothes-Dragon-Ball-Z-Hoodies-Kids-Hoodies-Anime-Boys-Girls-Tops-Children-1.jpg_640x640-1.jpg",
            category: "kids"
        },
        {
            name: "Kids' Naruto Pajamas",
            price: 19.99,
            image: "https://m.media-amazon.com/images/I/61ot4ei5I1L._SX679_.jpg",
            category: "kids"
        }
        ];


        await Product.deleteMany({});
        console.log('Cleared existing products');
        await Product.insertMany(products);
        console.log('Products seeded successfully');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding products:', error);
        mongoose.connection.close();
        process.exit(1);
    }
}

seedProducts();
