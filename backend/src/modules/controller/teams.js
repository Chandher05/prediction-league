import Teams from '../../models/mongoDB/team';
import constants from '../../utils/constants';

/**
 * Add an team in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.addTeam = async (req, res) => {
	try {

		var existingTeam
		
		existingTeam = await Teams.find({
			uniqueCode: req.body.shortName
		})

		if (existingTeam.length > 0) {
			return res
			.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
			.send("Team already exists")
		}

		const teamData = new Teams({
			fullName: req.body.fullName,
			shortName: req.body.shortName,
			colorCode: req.body.colorCode
		})

		await teamData.save()

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send({
				createdTeam: teamData._id
			})
	} catch (error) {
		console.log(`Error while adding team ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * View all teams.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.allTeams = async (req, res) => {
	try {

		let allTeamData
		allTeamData = await Teams.find()
		
		let teamData = []
		for (var team of allTeamData) {
			teamData.push({
				teamId: team._id,
				fullName: team.fullName,
				shortName: team.shortName,
				colorCode: team.colorCode
			})
		}

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(teamData)
	} catch (error) {
		console.log(`Error while viewing all teams ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * View team by id.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getTeamById = async (req, res) => {
	try {

		


		
		return

		let team = await Teams.findById(req.params.teamId)
		
		let teamData = {
				teamId: team._id,
				fullName: team.fullName,
				shortName: team.shortName,
				colorCode: team.colorCode
			}

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(teamData)
	} catch (error) {
		console.log(`Error while viewing all teams ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Update team.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.updateTeam = async (req, res) => {
	try {

		await Teams.findByIdAndUpdate(
			req.body.teamId,
			{
				fullName: req.body.fullName,
				shortName: req.body.shortName,
				colorCode: req.body.colorCode
			}
		)
		
		let allTeamData
		allTeamData = await Teams.find()
		
		let teamData = []
		for (var team of allTeamData) {
			teamData.push({
				teamId: team._id,
				fullName: team.fullName,
				shortName: team.shortName,
				colorCode: team.colorCode
			})
		}

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(teamData)


	} catch (error) {
		console.log(`Error in game/isTeamPartOfGame ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}