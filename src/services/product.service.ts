import { Product, IProduct } from '../models/product.model';

export const getAllProducts = async (): Promise<IProduct[]> => {
    return Product.find();
}

export const getProductById = async (id: string): Promise<IProduct> => {
    const product = await Product.findById(id);
    if (!product) {
        throw new Error('Product not found');
    }

    return product;
}

export const getProductsByIds = async (ids: string[]): Promise<IProduct[]> => {
    const product = await Product.find({_id: {$in: ids}});
    if (!product) {
        throw new Error('Product not found');
    }

    return product;
}

export const createProduct = async (data: Partial<IProduct>): Promise<IProduct> => {
    const product = new Product(data);
    return product.save();
}

export const updateProduct = async (id: string, data: Partial<IProduct>): Promise<IProduct> => {
    const product = await Product.findById(id);
    if (!product) {
        throw new Error('Product not found');
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });
    if (!updatedProduct) {
        throw new Error('Failed to update product');
    }

    return updatedProduct;
}


export const deleteProduct = async (id: string): Promise<IProduct> => {
    const product = await Product.findById(id);
    if (!product) {
        throw new Error('Product not found');
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
        throw new Error('Failed to delete product');
    }
    
    return deletedProduct;
}


