import { StatusCodes } from "http-status-codes";
import shortenModel from "../model/shorten.model.js";

const shortChecker = async (res, req, next) => {
	try {
		let { url: givenShort } = req;
		console.log(req.url)
		//validator needed. WE only need short codes and we don't need special characters. Also I think the maximum should be maybe 6 chactarers with any mix of numbers and or letters
		givenShort = givenShort.replace("/", "");
		// console.log(givenShort)
		if (!givenShort || givenShort === "/") {
			return next({
				status: StatusCodes.BAD_REQUEST,
				message: "Short code(short URL) required",
			});
		}

		const findShort = await shortenModel.findOne({ shortCode: givenShort });
		if (!findShort) {
			return next({
				status: StatusCodes.NOT_FOUND,
				message: "The requested short code was not found.",
			});
		}
		next();
	} catch (err) {
		next(err);
	}
};

export default shortChecker;