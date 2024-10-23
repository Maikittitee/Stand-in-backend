import mongoose, { Schema, Document, Model } from "mongoose";
import { ShoppingTaskType } from "./shopping.js";
// Define an interface that represents a document in MongoDB.
interface IShoppingCart extends Document {
  user: string;
  items: Array<ShoppingTaskType>;
  update_at: Date;

}

export const ShoppingCartSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId, 
		require: true,
	},
	items: {
		type: Array<Schema.Types.ObjectId>
	}
})

// export const ShoppingCartModel = new Model()

const ShoppingCartModel: Model<IShoppingCart> = mongoose.model<IShoppingCart>("Cart", ShoppingCartSchema);
export default ShoppingCartModel;