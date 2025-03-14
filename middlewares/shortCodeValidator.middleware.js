import { StatusCodes } from "http-status-codes";
import validator from "validator";
import shortenModel from "../model/shorten.model.js";

const shortCodeValidator = async (req, _res, next) => {
	try {
		let givenShort = req.params.givenShort || req.url;

		if (
			!givenShort ||
			!validator.isAlphanumeric(givenShort, "en-US") ||
			!validator.isLength(givenShort, { min: 6, max: 6 })
		) {
			return next({
				status: StatusCodes.BAD_REQUEST,
				message: "Invalid short code. Short code required",
			});
		}

		if (req.method === "GET") {
			const findShort = await shortenModel.findOne({
				shortCode: givenShort,
			});

			if (!findShort) {
				return next({
					status: StatusCodes.NOT_FOUND,
					message: "The requested short code was not found.",
				});
			}

			req.user = { ...req.user, findShort };
			next();
		} else {
			//For patch and delete
			req.user = { ...req.user, givenShort };
			next();
		}
	} catch (err) {
		next(err);
	}
};

export default shortCodeValidator;
