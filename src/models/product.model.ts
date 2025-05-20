import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    category: string;
    description?: string;
    price: number;
    stock_level: number;
    min_stock: number;
    image_url: string;
}

const productSchema = new Schema<IProduct>({
    name: { type: String, unique: true, required: true },
    description: { type: String },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock_level: { type: Number, required: true },
    min_stock: { type: Number, required: true, default: 5 },
    image_url: { type: String, required: true },
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

productSchema.virtual('status').get(function () {
    if (this.stock_level === 0) return 'Out of Stock';
    if (this.stock_level <= this.min_stock) return 'Low Stock';
    return 'In Stock';
});



export const Product = model<IProduct>('Product', productSchema);
