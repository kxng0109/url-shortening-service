import { config } from "dotenv";
import app from "./app.js";
import connectDB from "./db/connectDB.js";
config();

const PORT = process.env.PORT || 3000;

const setupServer = async () => {
	try {
		app.listen(PORT, () => console.log(`Server ruuning on port ${PORT}`));
		await connectDB();
		console.log("Connected to mongo database!");
	} catch (err) {
		console.error("Error occurred will setting up server", err);
	}
};

export default setupServer;