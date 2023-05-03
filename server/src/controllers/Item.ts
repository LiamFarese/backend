import { Request, Response } from "express";
import { IItem, Item } from "../models/Item";

/**create new item under a vendor */
export const createItem = async (req: Request, res: Response) => {
  try {
    const nameValidate = await Item.findOne({ name: req.body.name, vendorId: req.body.vendorId});

    if (nameValidate){
      return res.status(400).json({message: "Item name already exists"});
    }

    if(typeof req.body.price !== "number"){
      return res.status(400).json({message: "price must be an number" })
    }
    if(typeof req.body.stock !== "number"){
      return res.status(400).json({message: "stock must be an number" })
    }

    const newItem = new Item({
      name: req.body.name,
      price: req.body.price,  
      stock: req.body.stock,
      category: req.body.category,
      vendorId: req.body.vendorId
    });
    const savedItem = await newItem.save();
    return res.status(201).json(savedItem);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

/** retreives item */
export const getItem = async (req: Request, res: Response) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json(item);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getAllItems = async (req: Request, res: Response) => {
  try {
    const items = await Item.find();
    if(items.length === 0){
      return res.status(404).json({message: "No users found"});
    }
    return res.status(200).json(items);
  } catch (err: any) {
    return res.status(500).json({ err: err.message });
  }
};


/**retreive all items from vendor */
export const getAllVendorItems = async (req: Request, res: Response) => {
  try {
    const vendorId = req.params.vendorId;
    const items = await Item.find({ vendorId: vendorId });
    return res.status(200).json(items);
  } catch (err: any) {
    return res.status(500).json({ err: err.message });
  }
};

export const getByCategory = async (req: Request, res: Response) => {
  try {
    const category = req.params.category;
    const items = await Item.find({category: category});

    if (items.length === 0){
      return res.status(404).json({message: "No items of that category found"});
    }
  } catch (err: any) {
    return res.status(500).json({err: err.message});
  }
}

/** Update price */
export const updatePrice = async (req: Request, res: Response) => {
  try {
    const itemId = req.params.itemId;
    const newPrice = req.body.newPrice;
    const item = await Item.findById(itemId);
    console.log(item);
    if (!item) {
      return res.status(404).json({ message: "Item does not exist" });
    }
    item.price = newPrice;
    const savedItem = await item.save();
    return res.status(200).json(savedItem);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

/**update Stock */
export const updateStock = async (req: Request, res: Response) => {
  try {
    const itemId = req.params.itemId;
    const newStock = req.body.newStock;
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item does not exist" });
    }

    item.stock = newStock;
    const savedItem = await item.save();

    return res.status(200).json(savedItem);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

/**delete item */
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findByIdAndDelete(itemId);
    if(item){
      return res.status(202).json({ message: "item successfully deleted" });
    }
    else{
      return res.status(404).json({message: "item does not exist"});
      }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
