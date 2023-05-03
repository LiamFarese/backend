"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const OrderSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    vendorId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            itemId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Item", required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
        },
    ],
    customItems: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
        },
    ],
    total: { type: Number },
}, { timestamps: true });
const Order = (0, mongoose_1.model)("Order", OrderSchema);
exports.Order = Order;
// export const validateStock = async (items: any) => {
//   try {
//     for (const item of items) {
//       console.log(item.itemId);
//       const updateItem = await Item.findOne({_id: item.itemId });
//       console.log(updateItem);
//       /**makes sure there is enough stock to process the order and checks the item exists */
//       if (!updateItem){
//         throw new Error("Item does not exist");
//       }
//       if (updateItem.stock < item.quantity){
//         console.error("not enough stock", updateItem);
//       };
//     }
//     return true;
//   } catch (err) {
//     return console.error(err);
//   }
// }
// export const processOrder = async (items: any) => {
//   try {
//     for( const item of items){
//       const updateItem = await Item.findOne({_id: item.itemId });
//       if (!updateItem){
//         throw new Error("Item not found");
//       }
//       updateItem.stock -= item.quantity;
//       await updateItem.save();
//   }
//   } catch (err : any) {
//     return console.error(err);
//   }
// } 
// const validStock = await validateStock(items);
//     if (validStock) {
//       await processOrder(items);
//     }
