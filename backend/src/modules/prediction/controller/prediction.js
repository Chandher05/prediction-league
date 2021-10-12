import Game from '../../../models/mongoDB/game';
import Users from '../../../models/mongoDB/users';
import Prediction from '../../../models/mongoDB/prediction';
import constants from '../../../utils/constants';
import { Mongoose } from 'mongoose';

/**
 * Get all games in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.addPrediction = async (req, res) => {
	try {

		let user = await Users.findOne({
			uniqueCode: req.body.uniqueCode
		})

		if (!user) {
			return res
			.status(constants.STATUS_CODE.NO_CONTENT_STATUS)
			.send(null)
		}

		let userId = user._id


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
			confidence: req.body.confidence,
			predictedTeam: req.body.predictedTeam,
			userId: userId,
			gameId: req.body.gameId,
			predictionTime: req.body.predictionTime,
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

		console.log(allPredictions)

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

		console.log(allPlayers)

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

		console.log(returnData)


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