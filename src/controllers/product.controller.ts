import { NextFunction, Request, Response } from 'express';
import * as productService from '../services/product.service';


export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, price, stock_level, category, min_stock } = req.body;

        if (!req.file) {
           res.status(400).json({ message: 'Image file is required' });
           return;
        }
    
        const image_url = `/uploads/${req.file.filename}`;
    
        const product = await productService.createProduct({
          name,
          description,
          price,
          stock_level,
          image_url,
          category,
          min_stock
        });
        res.status(201).json(product);

    } catch (error) {
        next(error);
    }
}

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query;
        const products = await productService.getAllProducts(query);
        res.json(products);

    } catch (error) {
        next(error);
    }
}


export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.json(product);

    } catch (error) {
        next(error);
    }
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.id;
    const updateData = req.body;

    // If an image is uploaded, generate the new image URL
    if (req.file) {
      const imageUrl = `/uploads/${req.file.filename}`;
      updateData.image_url = imageUrl;
    }

    const updatedProduct = await productService.updateProduct(productId, updateData);

    if (!updatedProduct) {
       res.status(404).json({ message: 'Product not found' });
       return;
    }

    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};


export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.json({ message: 'Product deleted successfully' });

    } catch (error) {
        next(error);
    }
}

