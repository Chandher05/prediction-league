import Game from '../models/mongoDB/game';
import Prediction from '../models/mongoDB/prediction';
import Strategy from '../models/mongoDB/strategy';
import constants from './constants';

var updateStrategy = (gameId) => {

    return new Promise( async (resolve, reject) => {
        try {

            var gameData = await Game.findById(gameId)
            if (gameData.toss == null) {
                resolve()
            }

            var battingSecond = gameData.battingFirst.toString() == gameData.team1.toString()? gameData.team2 : gameData.team1
            var tossLoser = gameData.toss.toString() == gameData.team1.toString()? gameData.team2 : gameData.team1

            var allStrategies = await Strategy.find()
            for(var strategyObj of allStrategies) {
                await Prediction.updateMany(
                    {
                        userUID: strategyObj.userUID,
                        gameId: gameId
                    },
                    {
                        isConsidered: false
                    }
                )

                var strategyPrediction 
                if (strategyObj.typeOfStrategy == constants.STRATEGY.TOSS_WINNER) {
                    strategyPrediction = gameData.toss
                } else if (strategyObj.typeOfStrategy == constants.STRATEGY.TOSS_LOSER) {
                    strategyPrediction = tossLoser
                } else if (strategyObj.typeOfStrategy == constants.STRATEGY.BATTING_FIRST) {
                    strategyPrediction = gameData.battingFirst
                } else if (strategyObj.typeOfStrategy == constants.STRATEGY.BOWLING_FIRST) {
                    strategyPrediction = battingSecond
                } else {
                    continue
                }

                var predictionObj = new Prediction({
                    confidence: strategyObj.confidence,
                    predictedTeamId: strategyPrediction,
                    userUID: strategyObj.userUID,
                    gameId: gameId,
                    isStrategy: true
                })
                
                await predictionObj.save()
            }

            resolve()

        } catch (err) {
            reject(`Error in updating strategy ${err}`)
        }
    })

}

export default updateStrategy