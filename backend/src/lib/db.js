import mongoose from "mongoose"

export const connectDb = async ()=>{
  try {
    const conn=await mongoose.connect(process.env.MONGO_URI);
    console.log("mongo db connected successfully ");
    
  } catch (error) {
    console.log(error);
    process.exit(1)
    
  }
}