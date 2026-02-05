import Game from '../../models/mongoDB/game';
import Team from '../../models/mongoDB/team';
import Prediction from '../../models/mongoDB/prediction';
import Users from '../../models/mongoDB/users';
import constants from '../../utils/constants';
import updateLeaderboard from '../../utils/updateLeaderboard';
import updateStrategy from '../../utils/updateStrategies';
import config from '../../../config';
const axios = require('axios');

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

		let now = new Date();
		let allGames = [];
		let daysCompleted = 0;

		for (let i = 0; i < 7; i++) {
			let startOfDay = new Date(now);
			startOfDay.setDate(startOfDay.getDate() + i);
			startOfDay.setHours(0, 0, 0, 0);

			let endOfDay = new Date(startOfDay);
			endOfDay.setHours(23, 59, 59, 999);

			const games = await Game.find({
				startTime: {
				$gte: startOfDay,
				$lte: endOfDay,
				},
			}).sort('startTime');

			if (games.length > 0) {
				allGames.push(...games);
				daysCompleted += 1;
			}
			if (daysCompleted == 2) {
				break;
			}
		}

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

		if (req.body.team1 == req.body.team2) {
			return res
				.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send("Team 1 and 2 cannot be the same")
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

		const gameData = new Game({
			gameNumber: req.body.gameNumber,
			team1: req.body.team1,
			team2: req.body.team2,
			startTime: req.body.startTime,
			cricApiMatchId: req.body.cricApiMatchId,
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

		if (req.body.team1 == req.body.team2) {
			return res
				.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send("Team 1 and 2 cannot be the same")
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
				cricApiMatchId: oldValues.cricApiMatchId,
				battingFirst: req.body.battingFirst.length > 0? req.body.battingFirst: null,
				toss: req.body.toss.length > 0? req.body.toss: null,
				winner: req.body.winner.length > 0? req.body.winner: null,
				matchEnded: req.body.winner.length > 0? true: false
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
				toss: game.toss? game.toss: {},
				battingFirst: game.battingFirst? game.battingFirst: {},
				winner: game.winner? game.winner: {},
			})
		}

		await updateStrategy(req.body.gameId)


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


	
/**
 * Update schedule with cricapi.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.updateSchedule = async (req, res) => {
	try {

		let allTeams
		allTeams = await Team.find()

		let teamObj = {}
		for (var team of allTeams) {
			teamObj[team.fullName] = team._id
		}

		let allGames
		allGames = await Game.find().sort('startTime')

		let gameData = {}
		for (var game of allGames) {
			gameData[game.cricApiMatchId] = {
				gameId: game._id,
				startTime: game.startTime
			}
		}

		var response = await axios.get('https://api.cricapi.com/v1/series_info?apikey=' + config.cricapi.key + '&id=' + config.cricapi.series_id);
		if (response.status != 200) {
			return res
				.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
				.send("Cricapi failed with status " + response.status)
		}
		var api_response = response.data
		var all_matches = {}

		for (var game of api_response["data"]["matchList"]) {
			
			var team1 = teamObj[game["teams"][0]]
			if (team1 === undefined) {
				return res
					.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
					.send(game["teams"][0] + " team not available in database")
			}
			var team2 = teamObj[game["teams"][1]]
			if (team2 === undefined) {
				return res
					.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
					.send(game["teams"][1] + " team not available in database")
			}
			if (team1 != team2) {
				all_matches[game["dateTimeGMT"]] = {
					"team1": team1,
					"team2": team2,
					"startTime": game["dateTimeGMT"] + ".000Z",
					"cricApiMatchId": game["id"]
				}
			}
		}

		const sortedStartTimes = Object.keys(all_matches).sort()
		var index = 1
		for (var startTime of sortedStartTimes) {
			var gameObj = all_matches[startTime]
			var dbData = gameData[gameObj["cricApiMatchId"]]
			index += 1
			if (dbData === undefined) {
				gameObj["gameNumber"] = index
				gameObj["battingFirst"] = null
				gameObj["toss"] = null
				gameObj["winner"] = null
				var dbObj = new Game(gameObj)
				await dbObj.save()
			}
		}
		
		allGames = await Game.find().sort('startTime')

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(allGames)

	} catch (error) {
		console.log(`Error in adding a game ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}


/**
 * Update match winner using cric api.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
 exports.updateWinner = async (req, res) => {
	try {

		let allTeams
		allTeams = await Team.find()

		let teamObj = {}
		for (var team of allTeams) {
			teamObj[team.fullName] = team._id
		}

		let game = await Game.findById(req.params.gameId)

		let cricApiMatchId = game.cricApiMatchId
		if (cricApiMatchId.length == 0) {
			return res
				.status(constants.STATUS_CODE.UNPROCESSABLE_ENTITY_STATUS)
				.send("Cric API match id not available")
		}
		if (game.matchEnded) {
			return res
				.status(constants.STATUS_CODE.UNPROCESSABLE_ENTITY_STATUS)
				.send("Match has ended on database. Nothing to update")
		}

		
		var response = await axios.get('https://api.cricapi.com/v1/match_info?apikey=' + config.cricapi.key + '&id=' + cricApiMatchId);
		if (response.status != 200) {
			return res
				.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
				.send("Cricapi failed with status " + response.status)
		}
		var api_response = response.data

		if (!api_response["data"]["matchEnded"]) {
			return res
				.status(constants.STATUS_CODE.UNPROCESSABLE_ENTITY_STATUS)
				.send("Cannot update winner before match has ended")
		}
		
		let teams = api_response["data"]["teams"]
		let tossWinner = api_response["data"]["tossWinner"]
		let battingFirst = api_response["data"]["tossWinner"]
		let tossLoser = teams[0]
		if (tossLoser == tossWinner) {
			tossLoser = teams[1]
		}
		let tossChoice = api_response["data"]["tossChoice"]
		if (tossChoice == "bowl") {
			battingFirst = tossLoser
		}
		let matchWinner = api_response["data"]["matchWinner"]

		if (teams.includes(matchWinner)) {
			game["toss"] = teamObj[tossWinner]
			game["battingFirst"] = teamObj[battingFirst]
			game["winner"] = teamObj[matchWinner]
			game["matchEnded"] = true
		} else {
			game["matchEnded"] = true
		}

		await Game.findByIdAndUpdate(
			req.params.gameId,
			game
		)
		

		await updateStrategy(req.params.gameId)


		updateLeaderboard()


		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(game)
	} catch (error) {
		console.log(`Error while getting all games ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Check if user is able to add impact prediction.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.isImpactActive = async (req, res) => {
	try {
		var user = await Users.findOne({
			userUID: req.body.userUID,
			isActive: true
		})
		
		if (!user) {
			return res
			.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
			.send("User not active")
		}

		if (user.impactRemaining == 0) {
			return res
			.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
			.send("No impact remaining for user")
		}

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
		.sort({startTime : -1})
		.limit(1)

		if (allGames.length == 0) {
			return res
			.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
			.send("Tournament has not started")
		}
		let timeSinceStart = (new Date() - allGames[0].startTime) / (1000 * 60)

		if (timeSinceStart > constants.PREDICTION_INFO.TIME_SINCE_START_FOR_IMPACT) {
			return res
			.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
			.send("Cannot add impact prediction " + constants.PREDICTION_INFO.TIME_SINCE_START_FOR_IMPACT + " mins after match started")
		}

		let allPredictions = await Prediction.find({
			userUID: req.body.userUID,
			isConsidered: true,
			gameId: allGames[0]._id
		})

		if (allPredictions.length == 0) {
			return res
			.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
			.send("No prediction in latest game")
		}

		if (allPredictions[0].isImpact) {
			return res
			.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
			.send("Impact used for this game")
		}
		
		return res
			.status(constants.STATUS_CODE.SUCCESS_STATUS)
			.send({
				confidence: allPredictions[0].confidence,
				predictedTeam: teamObj[allPredictions[0].predictedTeamId],
				game: {
					gameId: allGames[0]._id,
					gameNumber: allGames[0].gameNumber,
					team1: teamObj[allGames[0].team1],
					team2: teamObj[allGames[0].team2]
				}
			})
	} catch (error) {
		console.log(`Error while getting scheduled game ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}