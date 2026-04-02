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
		
		allUsers.sort(function (a, b) {
		return a.totalScore - b.totalScore;
		});

		let leaderboardData = [];
		let userObj = {}
		for (var user of allUsers) {
			userObj[user.userUID] = user
			if (!user.isAdmin) {
				leaderboardData.push(user.username);
			}
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
					predictionTime: prediction.predictionTime,
					isConsidered: prediction.isConsidered
				})
			}

			returnData.push({
				gameNumber: game.gameNumber,
				teamsPlaying: [teamObj[game.team1].fullName, teamObj[game.team2].fullName],
				winner: game.winner? teamObj[game.winner].fullName: "",
				predictions: predictionData
			})
		}

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send({
				requestTime: new Date(),
				predictionData: returnData,
				leaderboard: leaderboardData
			})
	} catch (error) {
		console.log(`Error while adding user ${error}`)
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
      isActive: true,
    });

    allUsers.sort(function (a, b) {
      return a.totalScore - b.totalScore;
    });

    let leaderboardData = [];
    let playerPosition = 1;
    for (var obj of allUsers) {
      if (obj.isAdmin) {
        leaderboardData.push({
          position: null,
          username: obj.username,
          score: obj.totalScore,
          freeHitsRemaining: null,
          leavesRemaining: null,
          impactRemaining: null,
          isAdmin: true,
        });
      } else {
        leaderboardData.push({
          position: playerPosition,
          username: obj.username,
          score: obj.totalScore,
          freeHitsRemaining: obj.freeHitsRemaining,
          leavesRemaining: obj.leavesRemaining,
          impactRemaining: obj.impactRemaining,
          isAdmin: false,
        });
        playerPosition += 1;
      }
    }

    return res
      .status(constants.STATUS_CODE.ACCEPTED_STATUS)
      .send(leaderboardData);
  } catch (error) {
    console.log(`Error game/startGame ${error}`);
    return res
      .status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
      .send(error.message);
  }
};

/**
 * Get list of games that have not started in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.scheduledGames = async (req, res) => {
	try {

		const allTeams = await Team.find()

		const teamObj = {}
		for (const team of allTeams) {
			teamObj[team._id] = team
		}

		// Find the next game scheduled to start (startTime > now)
		const now = new Date()
		const nextGame = await Game.findOne({
			startTime: { $gt: now }
		}).sort('startTime')

		if (!nextGame) {
			return res
				.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
				.send({})
		}

		const gameData = {
			gameId: nextGame._id,
			gameNumber: nextGame.gameNumber,
			team1: teamObj[nextGame.team1] || null,
			team2: teamObj[nextGame.team2] || null,
			startTime: nextGame.startTime,
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
 * Get list of games that have not started in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.currentGamePredictions = async (req, res) => {
	try {

		let allTeams
		allTeams = await Team.find()

		let teamObj = {}
		for (var team of allTeams) {
			teamObj[team._id] = team
		}

		// Find games that started within the last two hours
		const now = new Date()
		const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)

		// Find one game that started within the last two hours (assume at most one)
		const game = await Game.findOne({
			startTime: {
				$gte: twoHoursAgo,
				$lte: now,
			},
		}).sort('startTime')

		// Load users to map usernames
		const allUsers = await Users.find()
		const userObj = {}
		for (const u of allUsers) {
			userObj[u.userUID] = u
		}

		if (!game) {
			return res
				.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
				.send({})
		}

		const predictions = await Prediction.find({
			gameId: game._id,
			isStrategy: false,
			isConsidered: true,
		})

		// Group predictions into team1/team2 and FH buckets, then sort
		let team1 = []
		let team2 = []
		let team1FH = []
		let team2FH = []

		for (const pred of predictions) {
			const entry = {
				username: (userObj[pred.userUID] && userObj[pred.userUID].username) || pred.userUID,
				prediction: {
					confidence: pred.confidence,
					predictedTeam: teamObj[pred.predictedTeamId] ? teamObj[pred.predictedTeamId] : {},
					predictionTime: pred.predictionTime,
					isConsidered: pred.isConsidered,
				},
			}

			if (pred.predictedTeamId.toString() == game.team1.toString()) {
				if (pred.confidence == "FH") team1FH.push(entry)
				else team1.push(entry)
			} else {
				if (pred.confidence == "FH") team2FH.push(entry)
				else team2.push(entry)
			}
		}

		team1.sort(function (a, b) {
			return parseInt(b.prediction.confidence) - parseInt(a.prediction.confidence)
		})

		team2.sort(function (a, b) {
			return parseInt(a.prediction.confidence) - parseInt(b.prediction.confidence)
		})

		const predictionsOrdered = team1FH.concat(team1).concat(team2).concat(team2FH)

		const returnData = {
			gameNumber: game.gameNumber,
			teamsPlaying: [teamObj[game.team1] ? teamObj[game.team1].fullName : '', teamObj[game.team2] ? teamObj[game.team2].fullName : ''],
			startTime: game.startTime,
			predictions: predictionsOrdered,
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