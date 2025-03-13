import shortenModel from "../model/shorten.model.js";

const accessCounter = async (urlID) => {
	await shortenModel.findByIdAndUpdate(urlID, {
		$inc: { accessCount: 1 },
	});
};

export default accessCounter;
