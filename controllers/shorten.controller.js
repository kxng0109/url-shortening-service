import { StatusCodes } from "http-status-codes";
import shortenModel from "../model/shorten.model.js";
import accessCounter from "../utils/accessCounter.js";
import nanoid from "../utils/shortCodeGenerator.js";

export const getShort = async (req, res, next) => {
	try {
		const { findShort } = req.user;

		const { _id, url, shortCode, createdAt, updatedAt } = findShort;
		await accessCounter(_id);
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

export const getShortStat = async (req, res, next) => {
	try {
		const { findShort } = req.user;

		const { _id, shortCode, url, createdAt, updatedAt, accessCount } =
			findShort;
		await accessCounter(_id);
		res.status(StatusCodes.OK).json({
			status: StatusCodes.OK,
			message: "Short URL retrieved successfully",
			data: {
				url,
				shortCode,
				createdAt,
				updatedAt,
				accessCount,
			},
		});
	} catch (err) {
		next(err);
	}
};

export const createShort = async (req, res, next) => {
	try {
		const { givenURL } = req.user;

		const findShort = await shortenModel.findOne({ givenURL });
		if (findShort && findShort !== null) {
			return next({
				status: StatusCodes.CONFLICT,
				message: "The provided URL already exists in the database.",
			});
		}

		const shortCode = nanoid();
		await shortenModel.create({ url: givenURL, shortCode });
		res.status(StatusCodes.CREATED).json({
			status: StatusCodes.CREATED,
			message: "Short URL created successfully.",
			data: {
				url: givenURL,
				shortCode,
			},
		});
	} catch (err) {
		if (err.message && err.message === "Short URL already exists") {
			return next({
				status: StatusCodes.CONFLICT,
				message: err.message,
			});
		}
		if (err.name && err.name === "ValidationError") {
			return next({
				status: StatusCodes.BAD_REQUEST,
				message: err.message,
			});
		}
		next(err);
	}
};

export const updateShort = async (req, res, next) => {
	try {
		const { givenShort, givenURL } = req.user;

		const updateShort = await shortenModel.findOneAndUpdate(
			{ shortCode: givenShort },
			{ url: givenURL },
			{ runValidators: true, new: true },
		);
		if (!updateShort) {
			return next({
				status: StatusCodes.NOT_FOUND,
				message: "The requested short code was not found.",
			});
		}

		const { _id, url, shortCode, createdAt, updatedAt } = updateShort;
		await accessCounter(_id);
		res.status(StatusCodes.OK).json({
			status: StatusCodes.OK,
			message: "URL updated successfully",
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

export const deleteShort = async (req, res, next) => {
	try {
		const { givenShort } = req.user;

		const deleteShort = await shortenModel.findOneAndDelete({
			shortCode: givenShort,
		});
		if (!deleteShort) {
			return next({
				status: StatusCodes.NOT_FOUND,
				message: "The requested short code was not found.",
			});
		}

		res.status(StatusCodes.NO_CONTENT).json({
			status: StatusCodes.NO_CONTENT,
			message: "URL deleted successfully.",
		});
	} catch (err) {
		next(err);
	}
};