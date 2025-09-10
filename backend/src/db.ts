// create user models and schemas here

import mongoose, {Mongoose, model, Schema, mongo } from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/MindDock")

const UserSchema = new Schema ({
    username: {type: String, unique: true},
    password: String
})

const ContentSchema = new Schema ({
    title: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true}
})

export const UserModel = model("User", UserSchema);
export const ContentModel = model("Content", ContentSchema)