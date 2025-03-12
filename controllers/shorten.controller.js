import { StatusCodes } from "http-status-codes";
import shortenModel from "../model/shorten.model.js";

export const getShort = async (req, res, next) => {
	try {
		const { url: givenURL } = req;
		console.log(givenURL);
		if (!givenURL) {
			return next({
				status: StatusCodes.BAD_REQUEST,
				message: "URL required",
			});
		}

		const findShort = await shortenModel.findOne({ url: givenURL });
		if (findShort) {
			return next({
				status: StatusCodes.CONFLICT,
				message: "The provided URL already exists in the database.",
			});
		}

		const { url, shortCode, createdAt, updatedAt } = findShort;

		res.status(StatusCodes.OK).json({
			status: StatusCodes.OK,
			message: "Short URL retrieved successfully",
			data: {
				url,
				shortCode,
				createdAt,
				updatedAt,
			},
		});
	} catch (err) {
		next(err);
	}
};

export const createShort = async (req, res, next) => {
	try {
		console.log(req.body);
		const { url: givenURL } = req.body;
		//Use validator here!!! It must start https://www. and it must be a valid url
		if (!givenURL) {
			return next({
				status: StatusCodes.BAD_REQUEST,
				message: "URL required",
			});
		}

		const findShort = await shortenModel.findOne({ url: givenURL });
		if (findShort) {
			return next({
				status: StatusCodes.CONFLICT,
				message: "The provided URL already exists in the database.",
			});
		}

		await shortenModel.create({ url: givenURL, shortCode: "abc123" });
		res.status(StatusCodes.CREATED).json({
			status: StatusCodes.CREATED,
			message: "Short URL created successfully.",
			data: {
				url: givenURL,
				shortCode: "abc123"
			},
		});
	} catch (err) {
		next(err);
	}
};
