import Game from '../../models/mongoDB/game';
import Users from '../../models/mongoDB/users';
import Prediction from '../../models/mongoDB/prediction';
import constants from '../../utils/constants';
import updateLeaderboard from '../../utils/updateLeaderboard';
import Team from '../../models/mongoDB/team';

/**
 * Add a prediction in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.addPrediction = async (req, res) => {
	try {

		var user = await Users.findOne({
			userUID: req.body.userUID,
			isActive: true
		})


		let userUID = req.body.userUID

		let game = await Game.findById(req.body.gameId)

		if (!user) {
			return res
			.status(constants.STATUS_CODE.UNPROCESSABLE_ENTITY_STATUS)
			.send("User not active")
		}

		if (!game) {
			return res
			.status(constants.STATUS_CODE.UNPROCESSABLE_ENTITY_STATUS)
			.send("Game not found")
		}

		var gameStartTime = new Date(game.startTime)
		var predictionTime = new Date()
		if (gameStartTime < predictionTime) {
			return res
			.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
			.send("Game already started")
		}

		if (req.body.confidence === "L") {
			await Prediction.updateMany(
				{
					userUID: userUID,
					gameId: req.body.gameId,
				},
				{
					isConsidered: false
				}
			)
			return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send("No prediction for game")
		}

		if (req.body.predictedTeamId != game.team1 && req.body.predictedTeamId != game.team2) {
			return res
			.status(constants.STATUS_CODE.UNPROCESSABLE_ENTITY_STATUS)
			.send("Predicted team must be one of the teams playing the game")
		}

		var confidence = req.body.confidence
		var confidenceRegex = new RegExp('^(5[1-9]|[6-9][0-9]|100|FH)$')
		if (!confidenceRegex.test(confidence)) {
			return res
			.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
			.send("Invalid confidence")
		}

		await Prediction.updateMany(
			{
				userUID: userUID,
				gameId: req.body.gameId,
			},
			{
				isConsidered: false
			}
		)
		
		const predictionData = new Prediction({
			confidence: confidence,
			predictedTeamId: req.body.predictedTeamId,
			userUID: userUID,
			gameId: req.body.gameId,
		})

		await predictionData.save()

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send({
				predictionId: predictionData._id
			})

	} catch (error) {
		console.log(`Error while adding a prediction ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Get list of predictions done by all users for a game.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getPredictionByGame = async (req, res) => {
	try {

		let allPredictions
		allPredictions = await Prediction.find({
			gameId: req.params.gameId,
			isStrategy: false
		})

		let gameData = await Game.findById(req.params.gameId)

		let team1Obj = await Team.findById(gameData.team1)

		let team2Obj = await Team.findById(gameData.team2)


		let allPlayers = {}
		for (var prediction of allPredictions) {
			if (prediction.userUID in allPlayers) {
				allPlayers[prediction.userUID].push({
					predictionId: prediction._id,
					confidence: prediction.confidence,
					predictedTeam: prediction.predictedTeamId.toString() == gameData.team1.toString()? team1Obj: team2Obj,
					predictionTime: prediction.predictionTime,
					isConsidered: prediction.isConsidered,
				})
			} else {
				allPlayers[prediction.userUID] = [{
					predictionId: prediction._id,
					confidence: prediction.confidence,
					predictedTeam: prediction.predictedTeamId.toString() == gameData.team1.toString()? team1Obj: team2Obj,
					predictionTime: prediction.predictionTime,
					isConsidered: prediction.isConsidered,
				}]
			}
		}


		let userData
		let returnData = []
		for (var userUID in allPlayers) {
			userData = await Users.findOne({
				userUID: userUID
			})
			returnData.push({
				mongoId: userData._id,
				username: userData.username,
				prediction: allPlayers[userUID]
			})
		}


		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(returnData)
	} catch (error) {
		console.log(`Error while getPredictionByGame ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Get list of active predictions done by users for a game.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getPredictionByGameToShowUser = async (req, res) => {
	try {

		let allPredictions
		allPredictions = await Prediction.find({
			gameId: req.params.gameId,
			isConsidered: true,
			isStrategy: false
		})

		let gameData = await Game.findById(req.params.gameId)

		let team1Obj = await Team.findById(gameData.team1)

		let team2Obj = await Team.findById(gameData.team2)


		let allPlayers = {}
		for (var prediction of allPredictions) {
			allPlayers[prediction.userUID] = {
				predictionId: prediction._id,
				confidence: prediction.confidence,
				predictedTeam: prediction.predictedTeamId.toString() == gameData.team1.toString()? team1Obj: team2Obj,
				predictionTime: prediction.predictionTime,
				isConsidered: prediction.isConsidered,
			}
		}


		let userData
		let returnData = []

		let team1 = []
		let team2 = []
		let team1FH = []
		let team2FH = []
		let constTeam = ""
		for (var userUID in allPlayers) {
			userData = await Users.findOne({
				userUID: userUID
			})
			if (constTeam == "") {
				constTeam = allPlayers[userUID].predictedTeam._id
			}
			if (constTeam == allPlayers[userUID].predictedTeam._id) {
				if (allPlayers[userUID].confidence == "FH") {
					team1FH.push({
						username: userData.username,
						prediction: allPlayers[userUID]
					})
				} else {
					team1.push({
						username: userData.username,
						prediction: allPlayers[userUID]
					})
				}

			} else {
				if (allPlayers[userUID].confidence == "FH") {
					team2FH.push({
						username: userData.username,
						prediction: allPlayers[userUID]
					})
				} else {
					team2.push({
						username: userData.username,
						prediction: allPlayers[userUID]
					})
				}
			}
		}

		team1.sort(function (a, b) {
			return b.prediction.confidence - a.prediction.confidence
		})

		team2.sort(function (a, b) {
			return a.prediction.confidence - b.prediction.confidence
		})

		returnData = team1FH.concat(team1)
		returnData = returnData.concat(team2)
		returnData = returnData.concat(team2FH)



		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(returnData)
	} catch (error) {
		console.log(`Error while getting scheduled game ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}


/**
 * Get leaderboard.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getLeaderboard = async (req, res) => {
	try {

		let allUsers = await Users.find({
			isActive: true
		})

		allUsers.sort(function(a, b) {
			return a.totalScore - b.totalScore
		})

		let leaderboardData = []
		let playerPosition = 1
		for (var obj of allUsers) {
			if (obj.isAdmin) {
				leaderboardData.push({
					position: null,
					username: obj.username,
					score: obj.totalScore,
					freeHitsRemaining: null,
					leavesRemaining: null,
					isAdmin: true
				})
			} else {
				leaderboardData.push({
					position: playerPosition,
					username: obj.username,
					score: obj.totalScore,
					freeHitsRemaining: obj.freeHitsRemaining,
					leavesRemaining: obj.leavesRemaining,
					isAdmin: false
				})
				playerPosition += 1
			}
		}

		return res
			.status(constants.STATUS_CODE.ACCEPTED_STATUS)
			.send(leaderboardData)

	} catch (error) {
		console.log(`Error game/startGame ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}


/**
 * Get predictions of user.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getPredictionsOfUser = async (req, res) => {
	try {

		let userData = await Users.findOne({
			userUID: req.body.userUID
		})
		

		let allPredictions = await Prediction.find({
			userUID: req.body.userUID,
			isConsidered: true
		})

		let predictionByGame = {}
		for (var prediction of allPredictions) {
			predictionByGame[prediction.gameId] = {
				confidence: prediction.confidence,
				predictedTeam: prediction.predictedTeamId
			}
		}
		
		let allGames = await Game.find().sort('startTime')
		let allTeams = await Team.find()
		let teamById = {}
		for (var teamObj of allTeams) {
			teamById[teamObj._id] = teamObj
		}

		let returnData = []
		let confidence, predictedTeam, gameStartTime, currentTime = new Date()
		for (var game of allGames) {
			gameStartTime = new Date(game.startTime)

			if (game._id in predictionByGame) {
				confidence = predictionByGame[game._id].confidence
				predictedTeam = teamById[predictionByGame[game._id].predictedTeam]
			} else if (gameStartTime < currentTime) {
				confidence = "L"
				predictedTeam = {}
			} else {
				confidence = "-"
				predictedTeam = {}	
			}

			
			returnData.push({
				gameNumber: game.gameNumber,
				team1: teamById[game.team1],
				team2: teamById[game.team2],
				confidence: confidence,
				predictedTeam: predictedTeam,
				winner: game.winner == null? {} : teamById[game.winner]
			})
		}


		return res
			.status(constants.STATUS_CODE.ACCEPTED_STATUS)
			.send({
				username: userData.username,
				// positionOnLeaderoard: userData.positionOnLeaderoard,
				// freeHitsRemaining: userData.freeHitsRemaining,
				// leavesRemaining: userData.leavesRemaining,
				score: userData.totalScore,
				predictions: returnData
			})

	} catch (error) {
		console.log(`Error getPredictionsOfUser ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}


/**
 * update prediction.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
// exports.updatePrediction = async (req, res) => {
// 	try {
		
// 		await Prediction.updateMany(
// 			{
// 				userUID: req.body.userUID,
// 				gameId: req.body.gameId
// 			},
// 			{
// 				isConsidered: false
// 			}
// 		)

// 		await Prediction.findByIdAndUpdate(
// 			req.body.newConsidered,
// 			{
// 				isConsidered: true
// 			}
// 		)


// 		let allPredictions
// 		allPredictions = await Prediction.find({
// 			gameId: req.params.gameId
// 		})


// 		let allPlayers = {}
// 		for (var prediction of allPredictions) {
// 			if (prediction.userUID in allPlayers) {
// 				allPlayers[prediction.userUID].push({
// 					predictionId: prediction._id,
// 					confidence: prediction.confidence,
// 					predictedTeam: prediction.predictedTeam,
// 					predictionTime: prediction.predictionTime,
// 					isConsidered: prediction.isConsidered,
// 				})
// 			} else {
// 				allPlayers[prediction.userUID] = [{
// 					predictionId: prediction._id,
// 					confidence: prediction.confidence,
// 					predictedTeam: prediction.predictedTeam,
// 					predictionTime: prediction.predictionTime,
// 					isConsidered: prediction.isConsidered,
// 				}]
// 			}
// 		}


// 		let userData
// 		let returnData = []
// 		for (var userUID in allPlayers) {
// 			userData = await Users.findById(userUID)
// 			returnData.push({
// 				userUID: userUID,
// 				username: userData.username,
// 				prediction: allPlayers[userUID]
// 			})
// 		}

// 		return res
// 			.status(constants.STATUS_CODE.ACCEPTED_STATUS)
// 			.send(returnData)

// 	} catch (error) {
// 		console.log(`Error game/startGame ${error}`)
// 		return res
// 			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
// 			.send(error.message)
// 	}
// }


/**
 * Get graph.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getGraph = async (req, res) => {
	try {
		
		let allGamesWithResult
		allGamesWithResult = await Game.find({
			winner: {
				$ne: null
			}
		})
		.sort('startTime')

		let allUsers 
		allUsers = await Users.find({
			isAdmin: false,
			isActive: true
		})

		let allPredictions = {},
			rawPredictions = {},
			rawScoreForGame = {},
			rawTotals = {},
			leaderboardPositions = {},
			gamesPlayedByUser = {},
			userTotals = {},
			userScores = {},
			userNames = {},
			leavesRemaining = {},
			freeHitsRemaining =  {},
			gameNumbers = []

		for (var userObj of allUsers) {
			allPredictions[userObj.userUID] = []
			rawPredictions[userObj.userUID] = []
			rawScoreForGame[userObj.userUID] = []
			rawTotals[userObj.userUID] = []
			leaderboardPositions[userObj.userUID] =  {
				username: userObj.username,
				scores: []
			}
			gamesPlayedByUser[userObj.userUID] = 0
			userTotals[userObj.userUID] = 0
			userScores[userObj.userUID] = {
				username: userObj.username,
				scores: []
			}
			userNames[userObj.userUID] = userObj.username
			leavesRemaining[userObj.userUID] = constants.PREDICTION_INFO.MAX_LEAVES_PER_PLAYER
			freeHitsRemaining[userObj.userUID] = constants.PREDICTION_INFO.MAX_FH_PER_PLAYER
		}

		let gameWinnerId = "",
			predictionsForGame,
			predictionByUser,
			leaderboardForGame = []

		for (var gameObj of allGamesWithResult) {
			gameNumbers.push(gameObj.gameNumber)
			gameWinnerId = gameObj.winner
			predictionByUser = {}

			predictionsForGame = await Prediction.find({
				gameId: gameObj._id,
				isConsidered: true,
				isStrategy: false
			})
			for (var temp of predictionsForGame) {
				if (temp.confidence == "FH" && temp.predictedTeamId == gameWinnerId) {
					predictionByUser[temp.userUID] = 0
					freeHitsRemaining[temp.userUID] -= 1
				} else if (temp.confidence == "FH" && freeHitsRemaining[temp.userUID] > 0) {
					predictionByUser[temp.userUID] = 0.25
					freeHitsRemaining[temp.userUID] -= 1
				} else if (temp.confidence == "FH") {
					predictionByUser[temp.userUID] = 1
				} else if (temp.confidence != "FH" && temp.predictedTeam == gameWinnerId) {
					predictionByUser[temp.userUID] = ((100 - temp.confidence) * (100 - temp.confidence)) / 10000
				} else {
					predictionByUser[temp.userUID] = (temp.confidence * temp.confidence) / 10000
				}
				rawScoreForGame[temp.userUID].push(predictionByUser[temp.userUID])
			}

			leaderboardForGame = []
			for (var userUID in allPredictions) {
				if (userUID in predictionByUser) {
					allPredictions[userUID].push(predictionByUser[userUID])
					userTotals[userUID] += predictionByUser[userUID]
					gamesPlayedByUser[userUID] += 1
				} else if (leavesRemaining[userUID] > 0) {
					allPredictions[userUID].push("L")
					leavesRemaining[userUID] -= 1
				} else {
					allPredictions[userUID].push(constants.PREDICTION_INFO.EXTRA_LEAVES_SCORE)
					userTotals[userUID] += constants.PREDICTION_INFO.EXTRA_LEAVES_SCORE
					gamesPlayedByUser[userUID] += 1
				}
				if (gamesPlayedByUser[userUID] == 0) {
					userScores[userUID].scores.push(0)
					leaderboardForGame.push({
						userUID: userUID,
						score: 0
					})
				} else {
					userScores[userUID].scores.push((userTotals[userUID] / gamesPlayedByUser[userUID]).toFixed(7))
					leaderboardForGame.push({
						userUID: userUID,
						score: (userTotals[userUID] / gamesPlayedByUser[userUID]).toFixed(7)
					})
				}
				rawTotals[userUID].push(userTotals[userUID])
			}

			leaderboardForGame.sort(function (a, b) {
				return a.score - b.score
			})
			for (var position = 1; position <= leaderboardForGame.length; position++) {
				leaderboardPositions[leaderboardForGame[position - 1].userUID].scores.push(position)
			}

		}


		return res
			.status(constants.STATUS_CODE.ACCEPTED_STATUS)
			.send({
				gameNumbers: gameNumbers,
				userScores: leaderboardPositions
			})

	} catch (error) {
		console.log(`Error game/getGraph ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}