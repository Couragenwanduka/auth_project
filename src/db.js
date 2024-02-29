import mongoose from "mongoose";

const connectdb= async()=>{
  try{
    await mongoose.connect("mongodb+srv://courageobunike:imthatbitch@cluster0.y2d9oib.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
   
    );
    console.log("Connected to MongoDB");
  }catch(err){
    console.log(err);
  }
};

export default connectdb;