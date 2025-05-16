import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.config'; // Adjust path if needed
import { IProduct, Product } from './models/product.model';
import { IOrder, Order } from './models/order.model';
import { IUser, User } from './models/user.model';
import bcrypt from 'bcryptjs';

dotenv.config();
const users: Partial<IUser>[] = [
    { name: 'Alice', email: 'alice@example.com', password: 'password123' },
    { name: 'Bob', email: 'bob@example.com', password: 'password456' },
    { name: 'Charlie', email: 'charlie@example.com', password: 'password789' },
  ];

  const products: Partial<IProduct>[] = [
    {
      name: 'Product A',
      description: 'Description for product A',
      price: 10,
      stock_level: 100,
      image_url: 'http://example.com/images/productA.png',
    },
    {
      name: 'Product B',
      description: 'Description for product B',
      price: 20,
      stock_level: 50,
      image_url: 'http://example.com/images/productB.png',
    },
    {
      name: 'Product C',
      description: 'Description for product C',
      price: 15,
      stock_level: 75,
      image_url: 'http://example.com/images/productC.png',
    },
  ];
  
const seedData = async () => {
  try {
    await connectDB(process.env.MONGO_URI!);

    for (const userData of users) {
        const hashedPassword = await bcrypt.hash(userData.password!, 10);
        await User.findOneAndUpdate(
          { email: userData.email },
          {
            $set: {
              name: userData.name,
              password: hashedPassword,
            },
          },
          { upsert: true, new: true }
        );
      }
      console.log('Users seeded.');
  
      // Seed Products with upsert
      for (const productData of products) {
        await Product.findOneAndUpdate(
          { name: productData.name },
          { $set: productData },
          { upsert: true, new: true }
        );
      }
      console.log('Products seeded.');
  
      // Fetch created users and products for Orders
      const dbUsers = await User.find({});
      const dbProducts = await Product.find();
  
      if (dbUsers.length === 0 || dbProducts.length === 0) {
        throw new Error('Users or Products not seeded properly');
      }
  
      // Create some sample orders

      if (!dbProducts[0]?._id || !dbProducts[1]?._id) {
        throw new Error('Product IDs are missing');
        return;
      }

        const orders: Partial<IOrder>[] = [
            {
                products: [
                  {
                    product_id: dbProducts[0]!._id as mongoose.Types.ObjectId,
                    
                    quantity: 2,
                  },
                  {
                    product_id: dbProducts[1]!._id as mongoose.Types.ObjectId,
                    
                    quantity: 2,
                  },
                ],
                customer_id: dbUsers[0]._id,
                order_status: 'Pending',
                order_date: new Date(),
                total_price: (dbProducts[0].price * 2) + (dbProducts[1].price * 1),
            },
            {
                products: [
                  {
                    product_id: dbProducts[0]!._id as mongoose.Types.ObjectId,
                    
                    quantity: 2,
                  },
                ],
                customer_id: dbUsers[0]._id,
                order_status: 'Pending',
                order_date: new Date(),
                total_price: (dbProducts[0].price * 2),
            },
        ];
  
      // Insert orders (no upsert for orders, usually insert-only)
      for (const orderData of orders) {
        const existingOrder = await Order.findOne({
          customer_id: orderData.customer_id,
          order_date: orderData.order_date,
        });
        if (!existingOrder) {
          const order = new Order(orderData);
          await order.save();
        }
      }
      console.log('Orders seeded.');
  
      process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
