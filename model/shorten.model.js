import { model, Schema } from "mongoose";
import validator from "validator";

// const regex = /^(https?:\/\/)(www\.)?[A-Za-z0-9]+(\.[A-Za-z0-9]+)+\/[A-Za-z0-9]+(?:\/[A-Za-z0-9]+)*(?:\?[A-Za-z0-9]+=[A-Za-z0-9]+(?:&[A-Za-z0-9]+=[A-Za-z0-9]+)*)?$/;
const regex = /^(https?:\/\/)(?:(?:www\.[A-Za-z0-9]+\.[A-Za-z0-9]+(?:\.[A-Za-z0-9]+)*)|(?:[A-Za-z0-9]+\.[A-Za-z0-9]+))\/[A-Za-z0-9]+(?:\/[A-Za-z0-9]+)*(?:\?[A-Za-z0-9]+=[A-Za-z0-9]+(?:&[A-Za-z0-9]+=[A-Za-z0-9]+)*)?$/

const shortenSchema = new Schema(
	{
		url: {
			type: String,
			required: [true, "Original URL required"],
			validate:{
				validator: function(value){
					return (validator.isURL(value, {protocols: ["http", "https"], require_protocol: true}) && regex.test(value))
				},
				message: props => `${props.value} is not a valid URL.`
			}
		},
		shortCode: {
			type: String,
			required: [true, "Shortened URL required"],
			unique: [true, "Short URL already exists"],
			minLength: 6,
			maxLength: 6,
			lowercase: true,
			validate:{
				validator: function (value){
					return validator.isAlphanumeric(value, "en-US");
				},
				message: props => `${props.value} is an invalid short code.`
			}
		},
		accessCount:{
			type: Number,
			default: 0,
		}
	},
	{ timestamps: true },
);

export default model("ShortSchema", shortenSchema);
