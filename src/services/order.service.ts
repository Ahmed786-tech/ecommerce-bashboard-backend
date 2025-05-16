import { Order, IOrder } from "../models/order.model";
import mongoose, { Types } from "mongoose";
import { Product } from "../models/product.model";

class NotFoundError extends Error {
    statusCode: number;
    constructor(message: string) {
        super(message);
        this.statusCode = 404;
    }
}

interface ProductInput {
    product_id: mongoose.Types.ObjectId;
    quantity: number;
}

interface CreateOrderInput {
    products: ProductInput[];
    customer_id: mongoose.Types.ObjectId;
}
interface UpdateOrderInput {
    products?: ProductInput[];
    order_status?: string;
}

export async function createOrder(data: CreateOrderInput): Promise<IOrder> {
    const { products, customer_id } = data;

    if (!Array.isArray(products) || products.length === 0) {
        throw new Error('Products array is required and cannot be empty');
    }

    let total_price = 0;
    const validatedProducts: ProductInput[] = [];

    for (const item of products) {
        const product = await Product.findById(item.product_id);
        if (!product) {
            throw new Error(`Product not found: ${item.product_id}`);
        }

        total_price += product.price * item.quantity;
        validatedProducts.push({
            product_id: new mongoose.Types.ObjectId(item.product_id),
            quantity: item.quantity
        });
    }

    const newOrder = new Order({
        products: validatedProducts,
        total_price,
        customer_id,
        order_date: new Date(),
        order_status: 'Pending'
    });

    return newOrder.save();
}

export async function getOrderById(orderId: string): Promise<IOrder> {
    if (!Types.ObjectId.isValid(orderId)) throw new NotFoundError("Invalid order ID");

    const order = await Order.findById(orderId).populate('product_id').populate('customer_id').exec();
    if (!order) throw new NotFoundError("Order not found");
    return order;
}


export async function updateOrder(orderId: string, updateData: UpdateOrderInput): Promise<IOrder> {
    const order = await Order.findById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }

    if (updateData.products && updateData.products.length > 0) {
        let total_price = 0;
        const validatedProducts: { product_id: mongoose.Types.ObjectId; quantity: number }[] = [];

        for (const item of updateData.products) {
            const product = await Product.findById(item.product_id);
            if (!product) {
                throw new Error(`Product not found: ${item.product_id}`);
            }

            validatedProducts.push({
                product_id: new mongoose.Types.ObjectId(item.product_id),
                quantity: item.quantity,
            });

            total_price += product.price * item.quantity;
        }

        order.products = validatedProducts;
        order.total_price = total_price;
    }

    if (updateData.order_status) {
        order.order_status = updateData.order_status;
    }

    return order.save();
}

export async function deleteOrder(orderId: string): Promise<IOrder> {
    if (!Types.ObjectId.isValid(orderId)) throw new NotFoundError("Invalid order ID");

    const deletedOrder = await Order.findByIdAndDelete(orderId).exec();
    if (!deletedOrder) throw new NotFoundError("Order not found");
    return deletedOrder;
}

export async function getAllOrders(): Promise<IOrder[]> {
    return Order.find().populate('product_id').populate('customer_id').exec();
}
