import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    first_name : String,
    last_name : String,
    email : {
        type: String,
        unique: true
    }, 
    password:{
        type: String, 
        required: true
    }
})

export const userModel = mongoose.model("user", usersSchema)