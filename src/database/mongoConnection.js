import mongoose from "mongoose";

export async function mongoConnect(){
  await  mongoose.connect("mongodb://localhost:27017/class-zero");
}