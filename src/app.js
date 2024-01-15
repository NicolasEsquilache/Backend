import express, { json } from 'express';
import ProductManager from './ProductManager.js';

const app = express();
const port = 8080;

app.use(json());

const productManager = new ProductManager("src/products.json");

app.get("/products", async (req, res) => {
    try {
        const productos = await productManager.getProducts();
        let limit = parseInt(req.query.limit);
        let productosLimitados = [...productos];


        if (!isNaN(limit) && limit > 0) {
            productosLimitados = productosLimitados.slice(0, limit);
        }

        res.send(productosLimitados);
    } catch (error) {
        console.error("Error al obtener los productos:", error.message);
    }
});

app.get("/products/:idProduct", async (req, res) => {

    try {
        const productos = await productManager.getProducts();
        let idProduct = parseInt(req.params.idProduct);
        console.log(idProduct);
        let producto = productos.find(u => u.id === idProduct);

        if (!producto) return res.send({ error: "producto no encontrado" });

        res.send(producto);
    } catch (error) {
        console.error("Error al obtener el producto:", error.message);
    }


});

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});