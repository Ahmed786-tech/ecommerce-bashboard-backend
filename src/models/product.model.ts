import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description?: string;
    price: number;
    stock_level: number;
    image_url: string;
}

const productSchema = new Schema<IProduct>({
    name: { type: String, unique: true, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock_level: { type: Number, required: true },
    image_url: { type: String, required: true },
},
    {
        timestamps: true
    }
);


export const Product = model<IProduct>('Product', productSchema);
