import { StatusCodes } from "http-status-codes";
import validator from "validator";

const regex = /^(https?:\/\/)(?:(?:www\.[A-Za-z0-9]+\.[A-Za-z0-9]+(?:\.[A-Za-z0-9]+)*)|(?:[A-Za-z0-9]+\.[A-Za-z0-9]+))(?:\/(?:[A-Za-z0-9]+(?:\/[A-Za-z0-9]+)*)?)?(?:\?[A-Za-z0-9]+=[A-Za-z0-9]+(?:&[A-Za-z0-9]+=[A-Za-z0-9]+)*)?$/;

const urlValidator = async(req, _res, next) =>{
	try{
		const { url: givenURL } = req.body;

		const isValidURL = validator.isURL(givenURL, {protocols: ["http", "https"], require_protocol: true}) && regex.test(givenURL);
		if (!isValidURL) {
			return next({
				status: StatusCodes.BAD_REQUEST,
				message: "Invalid URL. URL required!",
			});
		};
		
		req.user = {...req.user, givenURL};
		next();
	} catch(err){
		next(err)
	}
}

export default urlValidator;