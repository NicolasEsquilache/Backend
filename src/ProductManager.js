import { promises as fs } from 'fs';

export default class ProductManager {
    constructor() {
        this.productos = [];
        this.nextId = 1;
        this.path = "products.json";
    }

    async addProduct(producto) {

        if (!producto.title || !producto.description || !producto.price || !producto.thumbnail || !producto.code || !producto.stock) {
            console.error("Todos los campos son obligatorios.");
            return;
        }

        if (this.productos.some((p) => p.code === producto.code)) {
            console.error("El código ya existe.");
            return;
        }

        producto.id = this.nextId++;
        const { title, description, price, thumbnail, code, stock } = producto;

        const nuevoProducto = {
            id: producto.id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        this.productos.push(nuevoProducto);

        try {
            await fs.writeFile(this.path, JSON.stringify(this.productos), "utf-8");
            return nuevoProducto;
        } catch (error) {
            console.error("Error al escribir en el archivo:", error);
        }
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            if (!data) {
                return [];
            } else {
                return JSON.parse(data);
            }

        } catch (error) {
            console.error("Error al leer el archivo:", error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const data = await fs.readFile(this.path);
            const productos = JSON.parse(data);
            const producto = productos.find((p) => p.id === id);
            if (producto) {
                return producto;
            } else {
                throw new Error("Producto no encontrado");
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const data = await fs.readFile(this.path, 'utf-8');

            let productos = [];
            if (data) {
                try {
                    productos = JSON.parse(data);
                    if (!Array.isArray(productos)) {
                        throw new Error('El archivo no contiene un arreglo JSON válido.');
                    }
                } catch (parseError) {
                    throw new Error('El archivo no contiene un formato JSON válido.');
                }
            }

            const productoIndex = productos.findIndex((p) => p.id === id);

            if (productoIndex === -1) {
                throw new Error('Producto no encontrado');
            }

            productos[productoIndex] = { ...productos[productoIndex], ...updatedProduct };

            await fs.writeFile(this.path, JSON.stringify(productos), "utf-8");

            return productos[productoIndex];
        } catch (error) {
            console.error('Error al actualizar el producto:', error.message);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const data = await fs.readFile(this.path, 'utf-8');

            let productos = [];
            if (data) {
                try {
                    productos = JSON.parse(data);
                    if (!Array.isArray(productos)) {
                        throw new Error('El archivo no contiene un arreglo JSON válido.');
                    }
                } catch (parseError) {
                    throw new Error('El archivo no contiene un formato JSON válido.');
                }
            }

            const productoIndex = productos.findIndex((p) => p.id === id);

            if (productoIndex === -1) {
                throw new Error('Producto no encontrado');
            }

            const productoEliminado = productos.splice(productoIndex, 1)[0];

            await fs.writeFile(this.path, JSON.stringify(productos));

            return productoEliminado;
        } catch (error) {
            console.error('Error al eliminar el producto:', error.message);
            throw error;
        }
    }
}