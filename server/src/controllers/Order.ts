import { Order, IOrder } from "../models/Order";
import { User } from "../models/User";
import { Item } from "../models/Item";
import { Request, Response } from "express";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, vendorId, items, customItems, total  } = req.body;
    const user = await User.findById(userId);

    /**verifiying user and vendor exist */
    if (!user){
      return res.status(404).json({message: "user not found"});
    }
    const vendor = await User.findById(vendorId);
    if (!vendor){
      return res.status(404).json({message: "vendor not found"});
    }

    /**iterates over item array and retrieves id given to compare stock to quantity in order */
    for (const item of items) {
      const updateItem = await Item.findOne({_id: item.itemId });
      /**makes sure there is enough stock to process the order and checks the item exists */
      if (!updateItem){
        return res.status(404).json({message: `Item: ${item.name} does not exist`});
      } else if (updateItem.stock < item.quantity){
        return res.status(500).json({message: `Not enough stock of ${item.name}`})
      };
      }
    /**if all items are in stock they are subtracted from the databse */
    for( const item of items){
      const updateItem = await Item.findOne({_id: item.itemId });
      if (!updateItem){
        return res.status(404).json({message: "item not found"});
      }
      updateItem.stock -= item.quantity;
      await updateItem.save();
    }

    /**logic for if the order has custom items or not */
    let newOrder: IOrder;

    if (customItems.length > 0) {
      newOrder = await new Order({
        userId,
        vendorId,
        items,
        customItems,
        total
      }).save()
    }
    newOrder = await new Order({
      userId,
      vendorId,
      items,
      total
    }).save()
    return res.status(201).json(newOrder);
  } catch (err: any) {
    return res.status(500).json({error: err.message});
  }
}

/**read order */
export const getOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json(order);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

/**returns all orders, this will be an admin function only */
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();
    if (orders.length === 0) {
      return res.status(404).json({ message: "no orders found" });
    }
    return res.status(200).json(orders);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

/**returns all orders from the vendor, this will be restricted to the vendor only*/
export const getVendorOrders = async (req: Request, res: Response) => {
  try {
    const vendorId = req.params.vendorId;
    const orders = await Order.find({ vendorId: vendorId });
    if(orders.length === 0){
      return res.status(404).json({message: "no orders found"});
    }
    return res.status(200).json(orders);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

/**returns an array with the sales value from the last day, week and all time */
export const getSalesStats = async (req:Request, res:Response) => {
  try {
    const vendorId = req.params.vendorId;

    const [ today, week, orders ] = await Promise.all([
      Order.find({vendorId: vendorId, createdAt: {$gte: new Date(new Date().getTime() - (24 * 60 * 60 * 1000))}}),
      Order.find({ vendorId: vendorId, createdAt:  {$gte: new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000))}}),
      Order.find({ vendorId: vendorId }),

    ]);

    const todaySales = today.reduce((sum, value) => {
      return sum + value.total;
    }, 0);
    const weekSales = week.reduce((sum, value) => {
      return sum + value.total;
    }, 0);
    const salesTotal = orders.reduce((sum, value) => {
      return sum + value.total;
    }, 0);

    return res.status(200).json({sales: {today: todaySales, week: weekSales, total: salesTotal} });
  } catch (err: any) {
    return res.status(500).json({error: err.message});
  }
}

/**returns an array with the sales value from the last day, week and all time */
export const getAllSales = async (req:Request, res:Response) => {
  try {

    const [ today, week, orders ] = await Promise.all([
      Order.find({createdAt: {$gte: new Date(new Date().getTime() - (24 * 60 * 60 * 1000))}}),
      Order.find({createdAt:  {$gte: new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000))}}),
      Order.find(),

    ]);

    const todaySales = today.reduce((sum, value) => {
      return sum + value.total;
    }, 0);
    const weekSales = week.reduce((sum, value) => {
      return sum + value.total;
    }, 0);
    const salesTotal = orders.reduce((sum, value) => {
      return sum + value.total;
    }, 0);

    return res.status(200).json({sales: {today: todaySales, week: weekSales, total: salesTotal} });
  } catch (err: any) {
    return res.status(500).json({error: err.message});
  }
}

export const refundOrder= async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  console.log(orderId);
  let order;
  try {
    order = await Order.findByIdAndDelete(orderId);
    console.log(order);
    if(order){
      return res.status(200).json({message: "order successfully deleted"})
    }else {
      return res.status(404).json({message: "order does not exist"})

    }
  } catch (err: any) {
    return res.status(500).json({err: err.message});
  }
}