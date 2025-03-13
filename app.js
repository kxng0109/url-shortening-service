import cors from "cors";
import { config } from "dotenv";
import express from "express";
import ExpressMongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";
import connectDB from "./db/connectDB.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import shortRoute from "./routes/shorten.route.js";

config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(hpp());
app.use(ExpressMongoSanitize());
app.use(express.json());

app.use("/api/shorten", shortRoute);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

(async () => {
	try {
		app.listen(PORT, () => console.log(`Server ruuning on port ${PORT}`));
		await connectDB();
	} catch (err) {
		console.error("Error occurred will setting up server", err);
	}
})();

export default app;
