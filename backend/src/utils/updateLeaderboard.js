import Game from '../models/mongoDB/game';
import Users from '../models/mongoDB/users';
import Prediction from '../models/mongoDB/prediction';
import constants from './constants';

var updateLeaderboard = async () => {
    

		let maxLeavesAllowed = constants.PREDICTION_INFO.MAX_LEAVES_PER_PLAYER
		let scoreForExtraLeaves = constants.PREDICTION_INFO.EXTRA_LEAVES_SCORE
		
		let allUsersData = await Users.find({
			isActive: true
		})

	
		let allCompletedGames = await Game.find({
			winner: {
				$ne: ""
			}
		})

		let allWinners = []
		let predictionsByGame = {}
		let allPredictions
		for (var game of allCompletedGames) {
			allWinners.push(game.winner)

			allPredictions = await Prediction.find({
				gameId: game._id,
				isConsidered: true
			})
			predictionsByGame[game._id] = {}

			for (let prediction of allPredictions) {
				predictionsByGame[game._id][prediction.userUID] = {
					predictionId: prediction._id,
					confidence: prediction.confidence,
					predictedTeam: prediction.predictedTeam,
				}
			}
		}

		let allPredictionsByUsers = []
		let freeHitsTakenByUser = {}
		
		for (var user of allUsersData) {
			freeHitsTakenByUser[user.userUID] = 0
		}
		let prediction, predictedTeam, winner, leavesRemaining, leavesTaken = 0, totalScore = 0, totalGames = 0, extraLeavesTaken = 0
		for (var user of allUsersData) {
			leavesTaken = 0
			totalScore = 0
			totalGames = 0
			extraLeavesTaken = 0

			for (game of allCompletedGames) {


				if (user.userUID in predictionsByGame[game._id]) {
	
					totalGames += 1

					prediction = predictionsByGame[game._id][user.userUID].confidence
					predictedTeam = predictionsByGame[game._id][user.userUID].predictedTeam
					winner = game.winner
					if (prediction == "FH" && freeHitsTakenByUser[user.userUID] < constants.PREDICTION_INFO.MAX_FH_PER_PLAYER) {
						if (predictedTeam == winner) {
							prediction = 0
						} else {
							prediction = 50
						}
						freeHitsTakenByUser[user.userUID] += 1
					} else if (prediction == "FH") {			
						prediction = 100
						freeHitsTakenByUser[user.userUID] += 1
					} else if (predictedTeam == winner) {
						prediction = 100 - prediction
					} 
					
					prediction = prediction / 100
					totalScore = totalScore + (prediction * prediction)

				} else {
					leavesTaken += 1
				}
			}

			if (leavesTaken > maxLeavesAllowed) {
				extraLeavesTaken = leavesTaken - maxLeavesAllowed
				totalScore = totalScore + (scoreForExtraLeaves * extraLeavesTaken)
				leavesRemaining = 0
			} else {
				leavesRemaining = maxLeavesAllowed - leavesTaken
			}


			allPredictionsByUsers.push({
				userUID: user.userUID,
				username: user.username,
				isAdmin: user.isAdmin,
				score: (totalScore / (totalGames + extraLeavesTaken)).toFixed(7),
				leavesRemaining: leavesRemaining
			})
		}

		allPredictionsByUsers.sort(function(a,b) {
			return a.score - b.score
		})


		var position = 1, obj, freeHitsRemainingForUser

		for (obj of allPredictionsByUsers) {
			if (isNaN(obj.score)) {
				obj.score = 0
			}
			freeHitsRemainingForUser = Math.max(0, constants.PREDICTION_INFO.MAX_FH_PER_PLAYER - freeHitsTakenByUser[obj.userUID])
			if (obj.isAdmin) {
				await Users.findOneAndUpdate(
					{
						userUID: obj.userUID
					}, 
					{
						totalScore: obj.score,
					}
				)
			} else {
				await Users.findOneAndUpdate(
					{
						userUID: obj.userUID
					}, 
					{
						positionOnLeaderoard: position,
						totalScore: obj.score,
						leavesRemaining: obj.leavesRemaining,
						freeHitsRemaining: freeHitsRemainingForUser
					}
				)
				position += 1
			}
		}
}

export default updateLeaderboard;