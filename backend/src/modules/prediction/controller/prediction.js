import Game from '../../../models/mongoDB/game';
import Users from '../../../models/mongoDB/users';
import Prediction from '../../../models/mongoDB/prediction';
import constants from '../../../utils/constants';
import updateLeaderboard from '../../../utils/updateLeaderboard';

/**
 * Get all games in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.addPrediction = async (req, res) => {
	try {

		var user = await Users.findOne({
			uniqueCode: req.body.uniqueCode
		})


		let userId = user._id

		let game = await Game.findById(req.body.gameId)

		if (!user) {
			return res
			.status(constants.STATUS_CODE.UNPROCESSABLE_ENTITY_STATUS)
			.send("Invalid unique code")
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

		if (req.body.predictedTeam === "Leave") {
			await Prediction.updateMany(
				{
					userId: userId,
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

		if (req.body.predictedTeam != game.team1 && req.body.predictedTeam != game.team2) {
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

		let previousPrediction = await Prediction.findOne({
			userId: userId,
			gameId: req.body.gameId,
			isConsidered: true
		})

		// if (previousPrediction && previousPrediction.confidence == "FH") {
		// 	await Users.findByIdAndUpdate(
		// 		user._id,
		// 		{
		// 			$inc: {
		// 				freeHitsRemaining: 1
		// 			}
		// 		})
		// }
		// if (user.freeHitsRemaining == 0 && confidence == "FH") {
		// 	confidence = 100
		// } else if (confidence == "FH") {
		// 	await Users.findByIdAndUpdate(
		// 		user._id,
		// 		{
		// 			$inc: {
		// 				freeHitsRemaining: -1
		// 			}
		// 		})
		// }

		await Prediction.updateMany(
			{
				userId: userId,
				gameId: req.body.gameId,
			},
			{
				isConsidered: false
			}
		)
		
		const predictionData = new Prediction({
			confidence: confidence,
			predictedTeam: req.body.predictedTeam,
			userId: userId,
			gameId: req.body.gameId,
		})

		await predictionData.save()

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send({
				predictionId: predictionData._id
			})

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
exports.getPredictionByGame = async (req, res) => {
	try {

		let allPredictions
		allPredictions = await Prediction.find({
			gameId: req.params.gameId
		})


		let allPlayers = {}
		for (var prediction of allPredictions) {
			if (prediction.userId in allPlayers) {
				allPlayers[prediction.userId].push({
					predictionId: prediction._id,
					confidence: prediction.confidence,
					predictedTeam: prediction.predictedTeam,
					predictionTime: prediction.predictionTime,
					isConsidered: prediction.isConsidered,
				})
			} else {
				allPlayers[prediction.userId] = [{
					predictionId: prediction._id,
					confidence: prediction.confidence,
					predictedTeam: prediction.predictedTeam,
					predictionTime: prediction.predictionTime,
					isConsidered: prediction.isConsidered,
				}]
			}
		}


		let userData
		let returnData = []
		for (var userId in allPlayers) {
			userData = await Users.findById(userId)
			returnData.push({
				userId: userId,
				username: userData.username,
				prediction: allPlayers[userId]
			})
		}


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
 * Get list of games that have not started in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getPredictionByGameToShowUser = async (req, res) => {
	try {

		let allPredictions
		allPredictions = await Prediction.find({
			gameId: req.params.gameId
		})


		let allPlayers = {}
		for (var prediction of allPredictions) {
			if (prediction.isConsidered) {
				allPlayers[prediction.userId] = {
					predictionId: prediction._id,
					confidence: prediction.confidence,
					predictedTeam: prediction.predictedTeam,
					predictionTime: prediction.predictionTime,
					isConsidered: prediction.isConsidered,
				}
			}
		}


		let userData
		let returnData = []

		let team1 = []
		let team2 = []
		let team1FH = []
		let team2FH = []
		let constTeam = ""
		for (var userId in allPlayers) {
			userData = await Users.findById(userId)
			if (constTeam == "") {
				constTeam = allPlayers[userId].predictedTeam
			}
			if (constTeam == allPlayers[userId].predictedTeam) {
				if (allPlayers[userId].confidence == "FH") {
					team1FH.push({
						userId: userId,
						username: userData.username,
						prediction: allPlayers[userId]
					})
				} else {
					team1.push({
						userId: userId,
						username: userData.username,
						prediction: allPlayers[userId]
					})
				}

			} else {
				if (allPlayers[userId].confidence == "FH") {
					team2FH.push({
						userId: userId,
						username: userData.username,
						prediction: allPlayers[userId]
					})
				} else {
					team2.push({
						userId: userId,
						username: userData.username,
						prediction: allPlayers[userId]
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
 * Add a game.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.addGame = async (req, res) => {
	try {		

		
		const gameData = new Game({
			gameNumber: req.body.gameNumber,
			team1: req.body.team1,
			team2: req.body.team2,
			startTime: req.body.startTime,
			winner: req.body.winner
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

		await Game.findByIdAndUpdate(
			req.body.gameId,
			{
				gameNumber: req.body.gameNumber,
				team1: req.body.team1,
				team2: req.body.team2,
				startTime: req.body.startTime,
				winner: req.body.winner
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
				winner: game.winner
			})
		}


		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(gameData)

	} catch (error) {
		console.log(`Error game/resetGame ${error}`)
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
		for (var obj of allUsers) {
			leaderboardData.push({
				username: obj.username,
				score: obj.totalScore,
				freeHitsRemaining: obj.freeHitsRemaining,
				leavesRemaining: obj.leavesRemaining,
			})
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
			uniqueCode: req.params.userId
		})

		if (!userData) {
			return res
			.status(constants.STATUS_CODE.UNPROCESSABLE_ENTITY_STATUS)
			.send("Invalid unique code")
		}

		let allPredictions = await Prediction.find({
			userId: userData._id,
			isConsidered: true
		})

		let predictionByGame = {}
		for (var prediction of allPredictions) {
			predictionByGame[prediction.gameId] = {
				confidence: prediction.confidence,
				predictedTeam: prediction.predictedTeam
			}
		}
		
		let allGames = await Game.find().sort('startTime')

		let returnData = []
		let confidence, predictedTeam, gameStartTime, currentTime = new Date()
		for (var game of allGames) {
			gameStartTime = new Date(game.startTime)

			if (game._id in predictionByGame) {
				confidence = predictionByGame[game._id].confidence
				predictedTeam = predictionByGame[game._id].predictedTeam
			} else if (gameStartTime < currentTime) {
				confidence = "L"
				predictedTeam = "-"
			} else {
				confidence = "-"
				predictedTeam = "-"	
			}

			
			returnData.push({
				gameNumber: game.gameNumber,
				teams: game.team1 + " VS " + game.team2,
				confidence: confidence,
				predictedTeam: predictedTeam,
				winner: game.winner
			})
		}


		return res
			.status(constants.STATUS_CODE.ACCEPTED_STATUS)
			.send({
				username: userData.username,
				positionOnLeaderoard: userData.positionOnLeaderoard,
				// freeHitsRemaining: userData.freeHitsRemaining,
				// leavesRemaining: userData.leavesRemaining,
				score: userData.totalScore,
				predictions: returnData
			})

	} catch (error) {
		console.log(`Error game/startGame ${error}`)
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
exports.updatePrediction = async (req, res) => {
	try {
		
		await Prediction.updateMany(
			{
				userId: req.body.userId,
				gameId: req.body.gameId
			},
			{
				isConsidered: false
			}
		)

		await Prediction.findByIdAndUpdate(
			req.body.newConsidered,
			{
				isConsidered: true
			}
		)


		let allPredictions
		allPredictions = await Prediction.find({
			gameId: req.params.gameId
		})


		let allPlayers = {}
		for (var prediction of allPredictions) {
			if (prediction.userId in allPlayers) {
				allPlayers[prediction.userId].push({
					predictionId: prediction._id,
					confidence: prediction.confidence,
					predictedTeam: prediction.predictedTeam,
					predictionTime: prediction.predictionTime,
					isConsidered: prediction.isConsidered,
				})
			} else {
				allPlayers[prediction.userId] = [{
					predictionId: prediction._id,
					confidence: prediction.confidence,
					predictedTeam: prediction.predictedTeam,
					predictionTime: prediction.predictionTime,
					isConsidered: prediction.isConsidered,
				}]
			}
		}


		let userData
		let returnData = []
		for (var userId in allPlayers) {
			userData = await Users.findById(userId)
			returnData.push({
				userId: userId,
				username: userData.username,
				prediction: allPlayers[userId]
			})
		}

		return res
			.status(constants.STATUS_CODE.ACCEPTED_STATUS)
			.send(returnData)

	} catch (error) {
		console.log(`Error game/startGame ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}


/**
 * Get graph.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getGraph = async (req, res) => {
	try {
		
		let allCompletedGames
		allCompletedGames = await Game.find({
			winner: {
				$ne: ""
			}
		})
		.sort('startTime')

		let allUsers 
		allUsers = await Users.find({
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
			allPredictions[userObj._id] = []
			rawPredictions[userObj._id] = []
			rawScoreForGame[userObj._id] = []
			rawTotals[userObj._id] = []
			leaderboardPositions[userObj._id] =  {
				username: userObj.username,
				scores: []
			}
			gamesPlayedByUser[userObj._id] = 0
			userTotals[userObj._id] = 0
			userScores[userObj._id] = {
				username: userObj.username,
				scores: []
			}
			userNames[userObj._id] = userObj.username
			leavesRemaining[userObj._id] = 5
			freeHitsRemaining[userObj._id] = 2
		}

		let gameWinner = "",
			predictionsForGame,
			predictionByUser,
			leaderboardForGame = []

		for (var gameObj of allCompletedGames) {
			gameNumbers.push(gameObj.gameNumber)
			gameWinner = gameObj.winner
			predictionByUser = {}

			predictionsForGame = await Prediction.find({
				gameId: gameObj._id,
				isConsidered: true
			})
			for (var temp of predictionsForGame) {
				if (temp.confidence == "FH" && temp.predictedTeam == gameWinner) {
					predictionByUser[temp.userId] = 0
					freeHitsRemaining[temp.userId] -= 1
				} else if (temp.confidence == "FH" && freeHitsRemaining[temp.userId] > 0) {
					predictionByUser[temp.userId] = 0.25
					freeHitsRemaining[temp.userId] -= 1
				} else if (temp.confidence == "FH") {
					predictionByUser[temp.userId] = 1
				} else if (temp.confidence != "FH" && temp.predictedTeam == gameWinner) {
					predictionByUser[temp.userId] = ((100 - temp.confidence) * (100 - temp.confidence)) / 10000
				} else {
					predictionByUser[temp.userId] = (temp.confidence * temp.confidence) / 10000
				}
				rawScoreForGame[temp.userId].push(predictionByUser[temp.userId])
			}

			leaderboardForGame = []
			for (var userId in allPredictions) {
				if (userId in predictionByUser) {
					allPredictions[userId].push(predictionByUser[userId])
					userTotals[userId] += predictionByUser[userId]
					gamesPlayedByUser[userId] += 1
				} else if (leavesRemaining[userId] > 0) {
					allPredictions[userId].push("L")
					leavesRemaining[userId] -= 1
				} else {
					allPredictions[userId].push(0.35)
					userTotals[userId] += 0.35
					gamesPlayedByUser[userId] += 1
				}
				if (gamesPlayedByUser[userId] == 0) {
					userScores[userId].scores.push(0)
					leaderboardForGame.push({
						userId: userId,
						score: 0
					})
				} else {
					userScores[userId].scores.push((userTotals[userId] / gamesPlayedByUser[userId]).toFixed(7))
					leaderboardForGame.push({
						userId: userId,
						score: (userTotals[userId] / gamesPlayedByUser[userId]).toFixed(7)
					})
				}
				rawTotals[userId].push(userTotals[userId])
			}

			leaderboardForGame.sort(function (a, b) {
				return a.score - b.score
			})
			for (var position = 1; position <= leaderboardForGame.length; position++) {
				leaderboardPositions[leaderboardForGame[position - 1].userId].scores.push(position)
			}

		}


		return res
			.status(constants.STATUS_CODE.ACCEPTED_STATUS)
			.send({
				gameNumbers: gameNumbers,
				userScores: leaderboardPositions
			})

	} catch (error) {
		console.log(`Error game/startGame ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}