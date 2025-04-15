import Game from '../models/mongoDB/game';
import Team from '../models/mongoDB/team';
import updateLeaderboard from './updateLeaderboard';
import updateStrategy from './updateStrategies';
import config from '../../config';
const axios = require('axios');
import cron from "node-cron"

console.log('CRON running to update match winners')

cron.schedule('*/10 * * * *', async () => {
    const now = new Date();
    const eightHoursAgo = new Date(now.getTime() - 8 * 60 * 60 * 1000);
    let allGames = await Game.find({
        startTime: {
            $lte: new Date(),
            $gte: eightHoursAgo
        },
        matchEnded: false
    }).sort('startTime')
    if (allGames.length > 0) {
        await updateMatchWinner(allGames[0]._id)
    } else {
        console.log("No Games to update")
    }

})

var updateMatchWinner = (gameId) => {

    return new Promise( async (resolve, reject) => {
        
        try {
            let allTeams = await Team.find()

            let teamObj = {}
            for (var team of allTeams) {
                teamObj[team.fullName] = team._id
            }

            let game = await Game.findById(gameId)

            let cricApiMatchId = game.cricApiMatchId
            if (cricApiMatchId.length == 0) {
                console.log("CricApi Match ID missing in DB")
                resolve()
                return
            }
                   

            var response = await axios.get('https://api.cricapi.com/v1/match_info?apikey=' + config.cricapi.key + '&id=' + cricApiMatchId);
            if (response.status != 200) {
                console.log("Cricapi failed with status " + response.status)
                resolve()
                return
            }
            var api_response = response.data
            if (!api_response["data"]["matchEnded"]) {
                console.log("Waiting for game number " + game.gameNumber + " to end before updating")
                resolve()
                return
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
                gameId,
                game
            )
            console.log("Match winner for game number " + game.gameNumber + " has been updated")

            await updateStrategy(gameId)


            updateLeaderboard()
            resolve()
        } catch (err) {
            reject(err)
        }
    })

}
