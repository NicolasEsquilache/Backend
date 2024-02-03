import express from 'express';
import productRouter from './routes/product.router.js'
import cartRouter from './routes/cart.router.js'
import path from 'path'


import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products",productRouter);
app.use("/api/carts",cartRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'uploadFiles.html'))
})

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});