import { Request, Response, NextFunction } from "express";
import * as orderService from "../services/order.service";

import mongoose from "mongoose";



export async function createOrder(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { products } = req.body;
        const customer_id =new mongoose.Types.ObjectId(req.user?._id);
    
        const order = await orderService.createOrder({ products, customer_id });
        res.status(201).json(order);

    } catch (error) {
        next(error);
    }
}

export async function getOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const order = await orderService.getOrderById(req.params.id);
        res.json(order);

    } catch (error) {
        next(error);
    }
}

export async function updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const updatedOrder = await orderService.updateOrder(req.params.id, req.body);
        res.json(updatedOrder);

    } catch (error) {
        next(error);
    }
}



export async function deleteOrder(req: Request, res: Response, next: NextFunction) {
    try {
        await orderService.deleteOrder(req.params.id);
        res.json({ message: "Order deleted successfully" });

    } catch (error) {
        next(error);
    }
}

export async function getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
        const orders = await orderService.getAllOrders();
        res.json(orders);

    } catch (error) {
        next(error);
    }
}
