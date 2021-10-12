import Users from '../../../models/mongoDB/users';
import constants from '../../../utils/constants';

/**
 * Add an user in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.addUser = async (req, res) => {
	try {

		const userData = new Users({
			username: req.body.username,
			uniqueCode: req.body.uniqueCode
		})

		await userData.save()

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
				userId: user._id,
				username: user.username,
				uniqueCode: user.uniqueCode,
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
 * Update user.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.updateUser = async (req, res) => {
	try {
		
		await Users.findByIdAndUpdate(
			req.body.userId,
			{
				username: req.body.username,
				uniqueCode: req.body.uniqueCode,
				isActive: req.body.isActive
			}
		)
		
		let allUserData
		allUserData = await Users.find()
		
		let userData = []
		for (var user of allUserData) {
			userData.push({
				userId: user._id,
				username: user.username,
				uniqueCode: user.uniqueCode,
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