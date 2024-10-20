import mongoose, { Schema, Model } from "mongoose";

// Define an interface that represents a document in MongoDB.
interface IUser {
    username: string;
    password: string;
    email: string;
}

// Create the schema corresponding to the document interface.
export const UserSchema: Schema<IUser> = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});

// Create and export the model based on the schema and interface.
export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default User;