import express from 'express';
import productRouter from './routes/product.router.js'
import cartRouter from './routes/cart.router.js'
import viewsRouter from './routes/views.router.js'
import path from 'path'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ProductManager from './ProductManager.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
const pRouter = new ProductManager("src/products.json")

//app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'uploadFiles.html'))
//})
const httpServer = app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
//conexion con socket.io
const socketServer = new Server(httpServer)

//configuracion para handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, '/public')));
app.use("/", viewsRouter);

socketServer.on('connection', async socket => {
    console.log("nueva conexion");

    try {
        const products = await pRouter.getProducts();
        socketServer.emit("products", products);
    } catch (error) {
        socketServer.emit('response', { status: 'error', message: error.message });
    }

    socket.on("new-Product", async (newProduct) => {
        try {
            const objectProductNew = {
                title: newProduct.title,
                description: newProduct.description,
                code: newProduct.code,
                price: newProduct.price,
                status: newProduct.status,
                stock: newProduct.stock,
                category: newProduct.category,
                thumbnails: newProduct.thumbnails,

            }
            const pushProduct = await pRouter.addProduct(objectProductNew);
            const updatedListProd = await pRouter.getProducts();
            socketServer.emit("products", updatedListProd);
            socketServer.emit("response", { status: 'success', message: pushProduct });
            console.log(pushProduct);

        } catch (error) {
            socketServer.emit('response', { status: 'error', message: error.message });
        }
    })
    socket.on("delete-product", async (id) => {
        try {
            const pid = parseInt(id)
            pRouter.deleteProduct(pid)
            const updatedListProd = pRouter.getProducts()
            socketServer.emit("products", updatedListProd)
            socketServer.emit('response', { status: 'success', message: `Se ah eliminado el producto de ID:${pid}` });
        } catch (error) {
            socketServer.emit('response', { status: 'error', message: error.message });
        }
    })

})

