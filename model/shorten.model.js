import { model, Schema } from "mongoose";

const shortenSchema = new Schema(
	{
		url: {
			type: String,
			required: [true, "Original URL required"],
		},
		shortCode: {
			type: String,
			required: [true, "Shortened URL required"],
			unique: [true, "Short URL already exists"],
		},
	},
	{ timestamp: true },
);

export default model("ShortSchema", shortenSchema);
