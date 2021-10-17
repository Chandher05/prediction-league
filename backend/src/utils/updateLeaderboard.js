import Game from '../models/mongoDB/game';
import Users from '../models/mongoDB/users';
import Prediction from '../models/mongoDB/prediction';

var updateLeaderboard = async () => {
    

		let maxLeavesAllowed = 5
		let scoreForExtraLeaves = 0.3
		
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
				gameId: game._id
			})
			predictionsByGame[game._id] = {}
			for (let prediction of allPredictions) {
				if (prediction.isConsidered == true) {
					predictionsByGame[game._id][prediction.userId] = {
						predictionId: prediction._id,
						confidence: prediction.confidence,
						predictedTeam: prediction.predictedTeam,
					}
				}
			}
		}

		let allPredictionsByUsers = []
		// let confidence, team
		let prediction, predictedTeam, winner, leavesRemaining, leavesTaken = 0, totalScore = 0, totalGames = 0, extraLeavesTaken = 0
		for (var user of allUsersData) {
			// confidence = []
			// team = []
			leavesTaken = 0
			totalScore = 0
			totalGames = 0
			extraLeavesTaken = 0

			for (game of allCompletedGames) {


				if (user._id in predictionsByGame[game._id]) {
	
					totalGames += 1

					// confidence.push(predictionsByGame[game._id][user._id].confidence)
					// team.push(predictionsByGame[game._id][user._id].predictedTeam)

					prediction = predictionsByGame[game._id][user._id].confidence
					predictedTeam = predictionsByGame[game._id][user._id].predictedTeam
					winner = game.winner
					if (predictedTeam == winner) {
						if (prediction == "FH") {
							prediction = 100
						}
						prediction = 100 - prediction
					} else if (prediction == "FH") {
						prediction = 50
					}
					prediction = prediction / 100

					totalScore = totalScore + (prediction * prediction)

				} else {
					// confidence.push("L")
					// team.push("L")

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
				userId: user._id,
				username: user.username,
				// confidence: confidence,
				// team: team,
				// winner: allWinners,
				// total: totalScore,
				// gamesPlayed: totalGames + extraLeavesTaken,
				score: (totalScore / (totalGames + extraLeavesTaken)).toFixed(7),
				leavesRemaining: leavesRemaining
			})
		}

		allPredictionsByUsers.sort(function(a,b) {
			return a.score - b.score
		})



		var position, obj
		for (position = 0; position < allPredictionsByUsers.length; position++) {
			obj = allPredictionsByUsers[position]
			if (isNaN(obj.score)) {
				obj.score = 0
			}
			await Users.findByIdAndUpdate(
				obj.userId,
				{
					positionOnLeaderoard: position + 1,
					totalScore: obj.score,
					leavesRemaining: obj.leavesRemaining
				}
			)
		}
}

export default updateLeaderboard;