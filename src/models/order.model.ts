import mongoose, { Schema, model, Document, Types } from 'mongoose';

interface IOrderProduct {
  product_id: Types.ObjectId;
  quantity: number;
}

export interface IOrder extends Document {
  products: IOrderProduct[];
  total_price: number;
  order_date: Date;
  customer_id: Types.ObjectId;
  order_status: string;
}

const orderSchema = new Schema<IOrder>({
  products: [
    {
      product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true }
    }
  ],
  customer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  total_price: { type: Number, required: true },
  order_date: { type: Date, required: true },
  order_status: { type: String, required: true }
}, {
  timestamps: true
});

export const Order = model<IOrder>('Order', orderSchema);
