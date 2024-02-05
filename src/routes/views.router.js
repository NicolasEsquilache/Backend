import express from "express";
import ProductManager from "../../src/ProductManager.js";
const Product = new ProductManager("src/products.json");
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const products = await Product.getProducts();
        res.render('home', { layout: 'index', products });
    } catch (err) {

    }
});

router.get('/realTimeProducts', async (req, res) => {
    try {
        const products = await Product.getProducts();
        res.render('realTimeProducts', { layout: 'index', products });
    } catch (error) {

    }

});

export default router;