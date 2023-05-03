import { Schema, Types, model } from "mongoose";

interface IItem {
  _id: Types.ObjectId;
  name: string;
  price: number;
  stock: number;
  category: string;
  vendorId: Types.ObjectId;
}

const ItemSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true},
  vendorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Item = model<IItem>("Item", ItemSchema);

export { IItem, Item };
