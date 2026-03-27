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

		let allTeams
		allTeams = await Team.find()

		let teamObj = {}
		for (var team of allTeams) {
			teamObj[team._id] = team
		}

		// Return games starting within the next two hours
		const now = new Date();
		const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

		const games = await Game.find({
			startTime: {
				$gt: now,
				$lte: twoHoursLater,
			}
		}).sort('startTime');

		const gameData = games.map((game) => ({
			gameId: game._id,
			gameNumber: game.gameNumber,
			team1: teamObj[game.team1],
			team2: teamObj[game.team2],
			startTime: game.startTime,
		}));


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