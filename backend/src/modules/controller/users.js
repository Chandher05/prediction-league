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
			userId: req.body.userId
		})

		if (existingUser.length > 0) {
			return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send("User login success")
		}


		const userData = new Users({
			userId: req.body.userId,
			username: req.body.username,
			email: req.body.email
		})

		await userData.save()

		// UpdateLeaderboard()

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
 * Add an user in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.addUser = async (req, res) => {
	try {

		const userData = new Users({
			userId: req.body.userId + req.body.adminName,
			username: req.body.adminName,
			email: "admin@test.com",
			isAdmin: true
		})

		await userData.save()

		// UpdateLeaderboard()

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

// 		let user = await Users.findById(req.params.userId)
		
// 		let userData = {
// 				userId: user._id,
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
exports.updateUser = async (req, res) => {
	try {

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

		
		await Users.findByIdAndUpdate(
			req.body.mongoId,
			{
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
				userId: req.body.userId
			},
			{
				sendEmail: false
			}
		)

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send("Unsubscribed from email")


	} catch (error) {
		console.log(`Error in game/isUserPartOfGame ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}