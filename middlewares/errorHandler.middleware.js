import { getReasonPhrase, StatusCodes } from "http-status-codes";

export const errorHandler = (err, req, res, next) => {
	err.stack && console.error(err.stack);
	const statusCode = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
	const message = err.message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);
	res.status(statusCode).json({
		status: statusCode,
		error: getReasonPhrase(statusCode) || "Unknown Error",
		message,
		timestamp: new Date().toISOString(),
		path: `${req.method} ${req.url}`,
	});
};
