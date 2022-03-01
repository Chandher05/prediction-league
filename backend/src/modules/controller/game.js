import Game from '../../models/mongoDB/game';
import Team from '../../models/mongoDB/team';
import Prediction from '../../models/mongoDB/prediction';
import constants from '../../utils/constants';
import updateLeaderboard from '../../utils/updateLeaderboard';
import updateStrategies from '../../utils/updateStrategies';

/**
 * Get all games in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getAllGames = async (req, res) => {
	try {

		let allTeams
		allTeams = await Team.find()

		let teamObj = {}
		for (var team of allTeams) {
			teamObj[team._id] = team
		}

		let allGames
		allGames = await Game.find().sort('startTime')

		let gameData = []
		for (var game of allGames) {
			gameData.push({
				gameId: game._id,
				gameNumber: game.gameNumber,
				team1: teamObj[game.team1],
				team2: teamObj[game.team2],
				startTime: game.startTime,
				toss: game.toss in teamObj? teamObj[game.toss]: {},
				battingFirst: game.battingFirst in teamObj? teamObj[game.battingFirst]: {},
				winner: game.winner in teamObj? teamObj[game.winner]: {}
			})
		}


		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(gameData)
	} catch (error) {
		console.log(`Error while getting all games ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}


/**
 * Get game ny id from database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
 exports.getGameById = async (req, res) => {
	try {

		let allTeams
		allTeams = await Team.find()

		let teamObj = {}
		for (var team of allTeams) {
			teamObj[team._id] = team
		}

		let game = await Game.findById(req.params.gameId)

		let gameData = {
				gameId: game._id,
				gameNumber: game.gameNumber,
				team1: teamObj[game.team1],
				team2: teamObj[game.team2],
				startTime: game.startTime,
				toss: game.toss in teamObj? teamObj[game.toss]: {},
				battingFirst: game.battingFirst in teamObj? teamObj[game.battingFirst]: {},
				winner: game.winner in teamObj? teamObj[game.winner]: {}
			}


		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(gameData)
	} catch (error) {
		console.log(`Error while getting all games ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Get list of games that have not started in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.scheduledGames = async (req, res) => {
	try {

		let allTeams
		allTeams = await Team.find()

		let teamObj = {}
		for (var team of allTeams) {
			teamObj[team._id] = team
		}

		let allGames
		allGames = await Game.find({
			startTime: {
				$gt: new Date()
			}
		})
		.sort('startTime')
		.limit(2)

		let gameData = []
		for (var game of allGames) {
			gameData.push({
				gameId: game._id,
				gameNumber: game.gameNumber,
				team1: teamObj[game.team1],
				team2: teamObj[game.team2],
				startTime: game.startTime
			})
		}


		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(gameData)
	} catch (error) {
		console.log(`Error while getting scheduled game ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Get list of games that have started/completed in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.completedGames = async (req, res) => {
	try {

		let allTeams
		allTeams = await Team.find()

		let teamObj = {}
		for (var team of allTeams) {
			teamObj[team._id] = team
		}

		let allGames
		allGames = await Game.find({
			startTime: {
				$lte: new Date()
			}
		})
		.sort('startTime')

		let gameData = []
		for (var game of allGames) {
			gameData.push({
				gameId: game._id,
				gameNumber: game.gameNumber,
				team1: teamObj[game.team1],
				team2: teamObj[game.team2],
				startTime: game.startTime,
				toss: game.toss in teamObj? teamObj[game.toss]: {},
				battingFirst: game.battingFirst in teamObj? teamObj[game.battingFirst]: {},
				winner: game.winner in teamObj? teamObj[game.winner]: {}
			})
		}


		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(gameData)
	} catch (error) {
		console.log(`Error while getting scheduled game ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Add a game.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.addGame = async (req, res) => {
	try {		

		var existingGame = await Game.find({
			gameNumber: req.body.gameNumber
		})

		if (existingGame.length > 0) {
			return res
				.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send("Game number already exists")
		}

		// if (req.body.winner != req.body.team1 && req.body.winner != req.body.team2 && req.body.winner != "") {
		// 	return res
		// 		.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
		// 		.send("Winner is required in request. Winner must be blank or from one of the teams playing the game")
		// }


		// if (req.body.battingFirst != req.body.team1 && req.body.battingFirst != req.body.team2 && req.body.battingFirst != "") {
		// 	return res
		// 		.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
		// 		.send("Team batting first is required in request. Team batting first must be blank or from one of the teams playing the game")
		// }


		// if (req.body.toss != req.body.team1 && req.body.toss != req.body.team2 && req.body.toss != "") {
		// 	return res
		// 		.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
		// 		.send("Team winning toss is required in request. Team winning toss must be blank or from one of the teams playing the game")
		// }

		// if (req.body.winner != "" && (req.body.battingFirst == "" || req.body.toss == "")) {
		// 	return res
		// 		.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
		// 		.send("Team winning toss and batting first must not be blank if winner is provided")
		// }

		let teamInfo

		teamInfo = await Team.findById(req.body.team1)

		if (!teamInfo) {
			return res
				.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send("Team 1 does not exist")
		}

		teamInfo = await Team.findById(req.body.team2)

		if (!teamInfo) {
			return res
				.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send("Team 2 does not exist")
		}

		const gameData = new Game({
			gameNumber: req.body.gameNumber,
			team1: req.body.team1,
			team2: req.body.team2,
			startTime: req.body.startTime,
			battingFirst: null,
			toss: null,
			winner: null
		})

		await gameData.save()

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send({
				createdGame: gameData._id
			})

	} catch (error) {
		console.log(`Error in adding a game ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Update a game.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.updateGame = async (req, res) => {
	try {	


		var existingGame = await Game.find({
			_id: {
				$ne: req.body.gameId
			},
			gameNumber: req.body.gameNumber
		})

		if (existingGame.length > 0) {
			return res
				.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send("Game number already exists")
		}

		

		if (req.body.winner != req.body.team1 && req.body.winner != req.body.team2 && req.body.winner != "") {
			return res
				.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send("Winner is required in request. Winner must be blank or from one of the teams playing the game")
		}


		if (req.body.battingFirst != req.body.team1 && req.body.battingFirst != req.body.team2 && req.body.battingFirst != "") {
			return res
				.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send("Team batting first is required in request. Team batting first must be blank or from one of the teams playing the game")
		}


		if (req.body.toss != req.body.team1 && req.body.toss != req.body.team2 && req.body.toss != "") {
			return res
				.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send("Team winning toss is required in request. Team winning toss must be blank or from one of the teams playing the game")
		}

		if (req.body.winner != "" && (req.body.battingFirst == "" || req.body.toss == "")) {
			return res
				.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send("Team winning toss and batting first must not be blank if winner is provided")
		}

		let teamInfo

		teamInfo = await Team.findById(req.body.team1)

		if (!teamInfo) {
			return res
				.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send("Team 1 does not exist")
		}

		teamInfo = await Team.findById(req.body.team2)

		if (!teamInfo) {
			return res
				.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send("Team 2 does not exist")
		}

		var oldValues = await Game.findById(req.body.gameId)

		if (oldValues.team1 != req.body.team1) {
			await Prediction.updateMany(
				{
					gameId: req.body.gameId,
					predictedTeam: oldValues.team1
				},
				{
					predictedTeam: req.body.team1
				}
			)
		}
		if (oldValues.team2 != req.body.team2) {
			await Prediction.updateMany(
				{
					gameId: req.body.gameId,
					predictedTeam: oldValues.team2
				},
				{
					predictedTeam: req.body.team2
				}
			)
		}


		await Game.findByIdAndUpdate(
			req.body.gameId,
			{
				gameNumber: req.body.gameNumber,
				team1: req.body.team1,
				team2: req.body.team2,
				startTime: req.body.startTime,
				battingFirst: req.body.battingFirst.length > 0? req.body.battingFirst: null,
				toss: req.body.toss.length > 0? req.body.toss: null,
				winner: req.body.winner.length > 0? req.body.winner: null
			}
		)

		let allGames
		allGames = await Game.find()

		let gameData = []
		for (var game of allGames) {
			gameData.push({
				gameId: game._id,
				gameNumber: game.gameNumber,
				team1: game.team1,
				team2: game.team2,
				startTime: game.startTime,
				toss: game.toss,
				battingFirst: game.battingFirst,
				winner: game.winner,
			})
		}

		await updateStrategy("621b0d349ffb1e239445aa87")


		updateLeaderboard()


		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(gameData)

	} catch (error) {
		console.log(`Error game/update ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}


/**
 * Delete a game.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.deleteGame = async (req, res) => {
	try {

		let game
		game = await Game.findByIdAndDelete(
			req.params.gameId
		)


		if (!game) {
			return res
				.status(constants.STATUS_CODE.UNPROCESSABLE_ENTITY_STATUS)
				.send("Invalid game ID")
		}

		return res
			.status(constants.STATUS_CODE.ACCEPTED_STATUS)
			.send(game)

	} catch (error) {
		console.log(`Error game/startGame ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}