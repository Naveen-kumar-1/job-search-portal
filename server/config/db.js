import mongoose from "mongoose";

//Funtion to connect the mongoo db database

const connectDB = async () =>{

    mongoose.connection.on('connected',()=>console.log("Databse connected successfully"))

    await mongoose.connect(`${process.env.MONGODB_URI}/job-portal`)

}
export default connectDB