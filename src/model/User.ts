import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";


export const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        set: p => bcrypt.hashSync(p, 10),
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});


export const User = mongoose.model("User", userSchema);