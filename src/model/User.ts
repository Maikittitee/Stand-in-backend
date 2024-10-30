import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";


export const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        set: p => bcrypt.hashSync(p, 10),
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
}, {
    timestamps: true,
});


export const User = mongoose.model("User", userSchema);