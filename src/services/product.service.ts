import { Product, IProduct } from '../models/product.model';

interface IProductQuery {
  category?: string;
  startDate?: string; // ISO string
  endDate?: string;   // ISO string
}

export const getAllProducts = async (query: IProductQuery = {}): Promise<IProduct[]> => {
  const filter: any = {};

  // Filter by category
  if (query.category) {
    filter.category = {
      $regex: new RegExp(`^${query.category}$`, 'i') 
    };
  }

  // Filter by createdAt date range
  if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) {
      filter.createdAt.$gte = new Date(query.startDate);
    }
    if (query.endDate) {
      filter.createdAt.$lte = new Date(query.endDate);
    }
  }

  return Product.find(filter);
}

export const getProductById = async (id: string): Promise<IProduct> => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error('Product not found');
  }

  return product;
}

export const getProductsByIds = async (ids: string[]): Promise<IProduct[]> => {
  const product = await Product.find({ _id: { $in: ids } });
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


