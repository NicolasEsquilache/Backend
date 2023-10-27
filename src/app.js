import express from 'express';
import {ProductManager} from './Manager.js';

const manager = new ProductManager();


const app = express();
app.use(express.urlencoded({extended:true}));
const port = 8080; 


app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit; 

    const products = await manager.getProducts(); 

    if (limit) {
      const limitedProducts = products.slice(0, limit);
      res.json(limitedProducts);
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

app.get('/products/:pid', async (req, res) => {
  let productId = parseInt(req.params.pid,10);

  try {
    const product = await manager.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no existe' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});



app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});