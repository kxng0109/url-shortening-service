import { StatusCodes } from "http-status-codes";
import validator from "validator";
import shortenModel from "../model/shorten.model.js";
import accessCounter from "../utils/accessCounter.js";
import nanoid from "../utils/shortCodeGenerator.js";

const regex = /^(https?:\/\/)(?:(?:www\.[A-Za-z0-9]+\.[A-Za-z0-9]+(?:\.[A-Za-z0-9]+)*)|(?:[A-Za-z0-9]+\.[A-Za-z0-9]+))\/[A-Za-z0-9]+(?:\/[A-Za-z0-9]+)*(?:\?[A-Za-z0-9]+=[A-Za-z0-9]+(?:&[A-Za-z0-9]+=[A-Za-z0-9]+)*)?$/;

export const getShort = async (req, res, next) => {
	try {
		let { url: givenShort } = req;
		if(!givenShort || !validator.isAlphanumeric(givenShort, "en-US")){
			return next({
				status: StatusCodes.BAD_REQUEST,
				message: "Invalid short code. Short code required"
			})
		};

		const findShort = await shortenModel.findOne({ shortCode: givenShort });
		if (!findShort) {
			return next({
				status: StatusCodes.NOT_FOUND,
				message: "The requested short code was not found.",
			});
		}

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
		console.log(err);
		next(err);
	}
};

export const getShortStat = async(req, res, next) =>{
	try {
		let { shortCode } = req.params;
		if(!shortCode || !validator.isAlphanumeric(shortCode, "en-US")){
			return next({
				status: StatusCodes.BAD_REQUEST,
				message: "Invalid short code. Short code required"
			})
		};

		const findShort = await shortenModel.findOne({ shortCode: shortCode });
		if (!findShort) {
			return next({
				status: StatusCodes.NOT_FOUND,
				message: "The requested short code was not found.",
			});
		}

		const { _id, url, createdAt, updatedAt, accessCount } = findShort;
		await accessCounter(_id);
		res.status(StatusCodes.OK).json({
			status: StatusCodes.OK,
			message: "Short URL retrieved successfully",
			data: {
				url,
				shortCode,
				createdAt,
				updatedAt,
				accessCount
			},
		});
	} catch (err) {
		next(err);
	}
};

export const createShort = async (req, res, next) => {
	try {
		const { url: givenURL } = req.body;
		const isValidURL = validator.isURL(value, {protocols: ["http", "https"], require_protocol: true}) && regex.test(value);
		if (!isValidURL) {
			return next({
				status: StatusCodes.BAD_REQUEST,
				message: "Invalid URL. URL required!",
			});
		}

		const findShort = await shortenModel.findOne({ url: givenURL });
		if (findShort && findShort !== null) {
			return next({
				status: StatusCodes.CONFLICT,
				message: "The provided URL already exists in the database.",
			});
		}

		const shortCode = nanoid();
		await shortenModel.create({ url: givenURL, shortCode});
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
		if(err.name && err.name === "ValidationError"){
			return next({
				status: StatusCodes.BAD_REQUEST,
				message: err.message
			})
		}
		next(err);
	}
};

export const updateShort = async (req, res, next) => {
	try {
		let { url: givenShort } = req;
		let {url: givenURL} = req.body;
		//validator needed. WE only need short codes and we don't need special characters. Also I think the maximum should be maybe 6 chactarers with any mix of numbers and or letters
		givenShort = givenShort.replace("/", "");
		// console.log(givenShort)
		if (!givenURL || givenURL === "/") {
			return next({
				status: StatusCodes.BAD_REQUEST,
				message: "Short code(short URL) required",
			});
		}

		const updateShort = await shortenModel.findOneAndUpdate({shortCode: givenShort}, {url: givenURL}, {runValidators: true, new: true});
		if (!updateShort) {
			return next({
				status: StatusCodes.NOT_FOUND,
				message: "The requested short code was not found.",
			});
		}

		const {_id, url, shortCode, createdAt, updatedAt} = updateShort;
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

export const deleteShort = async(req, res, next) =>{
	try {
		let { url: givenShort } = req;
		if(!givenShort || !validator.isAlphanumeric(givenShort, "en-US")){
			return next({
				status: StatusCodes.BAD_REQUEST,
				message: "Invalid short code. Short code required"
			})
		};

		const deleteShort = await shortenModel.findOneAndDelete({ shortCode: givenShort });
		if (!deleteShort) {
			return next({
				status: StatusCodes.NOT_FOUND,
				message: "The requested short code was not found.",
			});
		}

		res.status(StatusCodes.NO_CONTENT).json({
			status: StatusCodes.NO_CONTENT,
			message: "URL deleted successfully."
		})
	}catch(err){
		next(err)
	}
}