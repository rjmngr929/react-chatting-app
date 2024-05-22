import User from "../models/UserData.js"
import jwt from "jsonwebtoken"
import fs from "fs"

export const user_auth = async (req, res, next) => {
	// console.log(req.headers);
	if (req.hasOwnProperty('headers') || req.headers.hasOwnProperty('authorization')) {
		var publicKey = fs.readFileSync('./Public.pem', 'utf-8') // READ PUBLIC KEY 
		var verifyOption = {
			algorithm: ['RS256']
		}
		try {
			/*
			 * Try to decode & verify the JWT token
			 * The token contains user's id ( it can contain more informations )
			 * and this is saved in req.user object
			 */
			// req.user = jwt.verify(req.headers['authorization'].slice(7), publicKey, verifyOption)

			
			const decoded = jwt.verify(req.headers['authorization'].slice(7), publicKey, verifyOption)

			req.user = await User.findById(decoded.user_id).select("-password");
			
			// console.log("new token is "+req.headers['authorization'].slice(7));
			// console.log(req.user);
			if(!req.user){
				return res.status(401).send({status: false, message: "token mismatched!"});
			}


		} catch (err) {

			console.log(err);
			/*
			 * If the authorization header is corrupted, it throws exception
			 * So return 401 status code with JSON error message
			 */
			return res.status(401).json({
				error: {
					msg: 'Failed to authenticate token!',
				}
			});
		}
	} else {
		/*
		 * If there is no autorization header, return 401 status code with JSON
		 * error message
		 */
		return res.status(401).json({
			error: {
				msg: 'No token found!'
			}
		});
	}
	next();
	return;

}