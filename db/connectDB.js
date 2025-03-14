import { config } from "dotenv";
import mongoose from "mongoose";
config();

const connectDB = async() => {
	try{
		await mongoose.connect(process.env.MONGO_URI).then(() => {
			console.log("Database Connected!");
		});
	} catch(err){
		console.error("Error occured while connecting to mongo database: ", err.message)
	}
};

export default connectDB;
