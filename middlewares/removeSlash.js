const removeSlash = (req, res, next) =>{
	if(req.url.startsWith('/')){
		req.url = req.url.slice(1);
	}
	next();
};

export default removeSlash;