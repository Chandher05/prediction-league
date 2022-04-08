import Game from '../../models/mongoDB/game';
import Prediction from '../../models/mongoDB/prediction';
import Team from '../../models/mongoDB/team';
import Users from '../../models/mongoDB/users';
import constants from '../../utils/constants';

/**
 * Login user.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
 exports.getData = async (req, res) => {
	try {
		let allTeams
		allTeams = await Team.find()

		let teamObj = {}
		for (var team of allTeams) {
			teamObj[team._id] = team
		}

		let allUsers
		allUsers = await Users.find()

		let userObj = {}
		for (var user of allUsers) {
			userObj[user.userUID] = user
		}

		let allGames
		allGames = await Game.find({
			startTime: {
				$lte: new Date()
			}
		})
		.sort('startTime')

		let predictionForGame,
			predictionData = [],
			returnData = []
		for (var game of allGames) {
			predictionForGame = await Prediction.find({
				gameId: game._id,
				isStrategy: false
			})

			predictionData = []
			for (var prediction of predictionForGame) {
				predictionData.push({
					username: userObj[prediction.userUID].username,
					predictedTeam: teamObj[prediction.predictedTeamId].fullName,
					confidence: prediction.confidence,
					isConsidered: prediction.isConsidered
				})
			}

			returnData.push({
				gameNumber: game.gameNumber,
				teamsPlaying: [teamObj[game.team1].fullName, teamObj[game.team2].fullName],
				winner: teamObj[game.winner].fullName,
				predictions: predictionData
			})
		}

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send({
				requestTime: new Date(),
				predictionData: returnData
			})
	} catch (error) {
		console.log(`Error while adding user ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}