import { Request, Response, NextFunction } from "express";
import * as dashboardService from '../services/dashboard.service';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query;
        const dashboard = await dashboardService.getDashboardStats(query);
        res.json(dashboard);

    } catch (error) {
        next(error);
    }
}