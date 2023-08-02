
import Contenedor from '../Contenedor.js';
import express from 'express';
import { Router } from 'express';

const carritosContenedor = new Contenedor('carrito.json');
const carritosRouter = express.Router();

carritosRouter.post('/', async (req, res) => {
  try {
    const carrito = { id: carritosContenedor.nextProductId, products: [] };
    const newCarritoId = await carritosContenedor.save(carrito);
    res.json({ id: newCarritoId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

carritosRouter.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    const carrito = await carritosContenedor.getById(Number(cid));
    if (carrito) {
      res.json(carrito);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

carritosRouter.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const carrito = await carritosContenedor.getById(Number(cid));
    if (carrito) {
      const product = { product: { id: Number(pid) }, quantity: Number(quantity) };
      carrito.products.push(product);
      await carritosContenedor.updateById(carrito.id, carrito);
      res.json({ message: 'Producto agregado al carrito' });
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
});

export default carritosRouter;