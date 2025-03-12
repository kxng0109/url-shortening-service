import { config } from "dotenv";
import express from "express";
import connectDB from "./db/connectDB.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import shortRoute from "./routes/shorten.route.js";

config();

const app = express();
const PORT = process.env.PORT || 3000;;
app.use(express.json())
app.use("/api/shorten", shortRoute);

app.use(errorHandler);


(async() =>{
	try {
		app.listen(PORT, () => console.log(`Server ruuning on port ${PORT}`));
		await connectDB();
	} catch (err) {
		console.error("Error occurred will setting up server", err);
	}
})()

export default app;
