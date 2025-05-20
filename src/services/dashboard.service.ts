import { PipelineStage } from 'mongoose';
import { Order } from '../models/order.model';
import { Product, IProduct } from '../models/product.model';
import { User } from '../models/user.model';

interface IDashboardQuery {
  startDate?: string;
  endDate?: string;
  category?: string;
}

export const getDashboardStats = async (query: IDashboardQuery = {}) => {
  const filter: any = {};

  const today = new Date();
  const last30Days = new Date();
  last30Days.setDate(today.getDate() - 30);
  
  filter.createdAt = { $gte: last30Days };

  if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) {
      filter.createdAt.$gte = new Date(query.startDate);
    }
    if (query.endDate) {
      filter.createdAt.$lte = new Date(query.endDate);
    }
  }

  const [totalProducts, totalOrders, totalRevenueResult,totalStock, outOfStock, lowStock, totalCustomers, recentOrders, revenueByDate,
    ordersByDate,
    salesByCategory] = await Promise.all([
      Product.countDocuments(filter),
      Order.countDocuments(filter),

      Order.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: "$total_price" } } }
      ]),

      Product.aggregate([
        {
          $group: {
            _id: null,
            totalStock: { $sum: "$stock_level" }
          }
        },
      ]),
      

      Product.countDocuments({ stock_level: { $lte: 0 } }),
      Product.countDocuments({$expr: { $lt: ["$stock_level", "$min_stock"] } }),
      User.countDocuments(),

      Order.find(filter)
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('products.product_id', 'name')
        .populate('customer_id', 'name email'),

      Order.aggregate([
        { $match: filter },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            totalRevenue: { $sum: "$total_price" }
          }
        },
        { $sort: { _id: 1 } }
      ]),


      Order.aggregate(ordersByDateAggregate(filter)),

      Order.aggregate(salesByCategoryAggregate(filter))

    ])

  const totalRevenue = totalRevenueResult[0]?.total || 0;


  return {
    totalProducts,
    totalOrders,
    totalRevenue,
    totalStock:totalStock[0].totalStock,
    outOfStock,
    lowStock,
    totalCustomers,
    recentOrders,
    revenueByDate,
    ordersByDate,
    salesByCategory,

  };
}

const ordersByDateAggregate = (filter:any): PipelineStage[] => {
  return [
    { $match: filter },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        totalOrders: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]
}

const salesByCategoryAggregate = (filter:any): PipelineStage[] => {

  return [
    { $match: filter },
    { $unwind: "$products" },
    {
      $lookup: {
        from: "products",
        localField: "products.product_id",
        foreignField: "_id",
        as: "productDetails"
      }
    },
    { $unwind: "$productDetails" },
    {
      $addFields: {
        orderDate: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        }
      }
    },
    {
      $group: {
        _id: {
          date: "$orderDate",
          category: "$productDetails.category"
        },
        totalSales: {
          $sum: {
            $multiply: [
              "$products.quantity",
              { $ifNull: ["$productDetails.price", 0] }
            ]
          }
        }
      }
    },
    {
      $group: {
        _id: "$_id.date",
        categories: {
          $push: {
            category: "$_id.category",
            totalSales: "$totalSales"
          }
        }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        date: "$_id",
        categories: 1
      }
    }
  ];
}



