
const express = require('express');

const ProductManager = require('./Manager.js');

const manager = new ProductManager();


const app = express();
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
  const productId = req.params.pid;

  try {
    const product = await manager.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      console.log(`Producto con id ${productId} no encontrado`);
      res.status(404).json({ error: 'Producto no existe' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});



app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});


  
  
