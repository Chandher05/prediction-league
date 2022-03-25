import Strategy from '../../models/mongoDB/strategy';
import Users from '../../models/mongoDB/users';
import constants from '../../utils/constants';
import UpdateLeaderboard from '../../utils/updateLeaderboard';

/**
 * Login user.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
 exports.loginUser = async (req, res) => {
	try {

		var existingUser
		
		existingUser = await Users.find({
			userUID: req.body.userUID
		})

		if (existingUser.length > 0) {
			return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send("User login success")
		}


		const userData = new Users({
			userUID: req.body.userUID,
			username: req.body.username,
			email: req.body.email
		})

		await userData.save()

		UpdateLeaderboard()

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send("User created")
	} catch (error) {
		console.log(`Error while adding user ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Add an admin in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.addAdmin = async (req, res) => {
	try {


		var confidence = req.body.confidence
		var confidenceRegex = new RegExp('^(5[1-9]|[6-9][0-9]|100)$')
		if (!confidenceRegex.test(confidence)) {
			return res
			.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
			.send("Confidence has to be a between 51-100")
		}

		var typeOfStrategy = req.body.typeOfStrategy
		if (typeOfStrategy !== constants.STRATEGY.BATTING_FIRST && typeOfStrategy !== constants.STRATEGY.BOWLING_FIRST && typeOfStrategy !== constants.STRATEGY.TOSS_WINNER && typeOfStrategy !== constants.STRATEGY.TOSS_LOSER) {
			return res
			.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
			.send("typeOfStrategy has to be TOSS_WINNER or BATTING_FIRST or BOWLING_FIRST or TOSS_LOSER")
		}


		const userData = new Users({
			userUID: req.body.adminId,
			username: req.body.adminName,
			email: "admin",
			isAdmin: true,
			sendEmail: false
		})

		await userData.save()

		const strategy = new Strategy({
			userId: userData._id,
			userUID: req.body.adminId,
			confidence: confidence,
			typeOfStrategy: typeOfStrategy
		})

		await strategy.save()

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send({
				createdUser: userData._id
			})
	} catch (error) {
		console.log(`Error while adding user ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * View all users.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.allUsers = async (req, res) => {
	try {

		let allUserData
		allUserData = await Users.find()
		
		let userData = []
		for (var user of allUserData) {
			userData.push({
				mongoId: user._id,
				username: user.username,
				isAdmin: user.isAdmin,
				isActive: user.isActive
			})
		}

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(userData)
	} catch (error) {
		console.log(`Error while viewing all users ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * View user by id.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
// exports.getUserById = async (req, res) => {
// 	try {

// 		let user = await Users.findById(req.params.userUID)
		
// 		let userData = {
// 				userUID: user._id,
// 				username: user.username,
// 				uniqueCode: user.uniqueCode,
// 				isActive: user.isActive
// 			}

// 		return res
// 			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
// 			.send(userData)
// 	} catch (error) {
// 		console.log(`Error while viewing all users ${error}`)
// 		return res
// 			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
// 			.send(error.message)
// 	}
// }

/**
 * Update user.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.updateAdmin = async (req, res) => {
	try {

		var confidence = req.body.confidence
		var confidenceRegex = new RegExp('^(5[1-9]|[6-9][0-9]|100)$')
		if (!confidenceRegex.test(confidence)) {
			return res
			.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
			.send("Confidence has to be a between 51-100")
		}

		var typeOfStrategy = req.body.typeOfStrategy
		if (typeOfStrategy !== constants.STRATEGY.BATTING_FIRST && typeOfStrategy !== constants.STRATEGY.BOWLING_FIRST && typeOfStrategy !== constants.STRATEGY.TOSS_WINNER && typeOfStrategy !== constants.STRATEGY.TOSS_LOSER) {
			return res
			.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
			.send("typeOfStrategy has to be TOSS_WINNER or BATTING_FIRST or BOWLING_FIRST or TOSS_LOSER")
		}

		var existingUser
		
		existingUser = await Users.find({
			_id: req.body.mongoId,
			isAdmin: false
		})

		if (existingUser.length > 0) {
			return res
			.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
			.send("Cannot update non admin user info")
		}

		await strategy.findOneAndUpdate(
			{
				userId: req.body.mongoId
			},
			{
				userUID: req.body.adminId,
				confidence: confidence,
				typeOfStrategy: typeOfStrategy
			}
		)

		await Users.findByIdAndUpdate(
			req.body.mongoId,
			{
				userUID: req.body.adminId,
				username: req.body.adminName
			}
		)
		
		let allUserData
		allUserData = await Users.find()
		
		let userData = []
		for (var user of allUserData) {
			userData.push({
				mongoId: user._id,
				username: user.username,
				isAdmin: user.isAdmin,
				isActive: user.isActive
			})
		}

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(userData)


	} catch (error) {
		console.log(`Error in game/isUserPartOfGame ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Unsubscribe from email updates user.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
 exports.unsubscribeUser = async (req, res) => {
	try {

		await Users.findOneAndUpdate(
			{
				userUID: req.body.userUID
			},
			{
				sendEmail: false
			}
		)

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send("Unsubscribed from email")


	} catch (error) {
		console.log(`Error in game/unsubscribeUser ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Resubscribe email updates for user.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
 exports.resubscribeUser = async (req, res) => {
	try {

		await Users.findOneAndUpdate(
			{
				userUID: req.body.userUID
			},
			{
				sendEmail: true
			}
		)

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send("Resubscribed to email")


	} catch (error) {
		console.log(`Error in game/resubscribeUser ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}