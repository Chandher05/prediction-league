import nodemailer from "nodemailer"
import Game from '../models/mongoDB/game';
import Team from '../models/mongoDB/team';
import Users from '../models/mongoDB/users';
import config from '../../config'
var CronJob = require('cron').CronJob


var job1 = new CronJob('0 0 * * *', async () => {
    sendMail(24, "schedule")
}, null, true, "Asia/Kolkata")

var job2 = new CronJob('30 15 * * *', async () => {
    sendMail(2, "reminder")
}, null, true, "Asia/Kolkata")

var job3 = new CronJob('30 19 * * *', async () => {
    sendMail(2, "reminder")
}, null, true, "Asia/Kolkata")

job1.start();
job2.start();
job3.start();


var sendMail = async (hoursOffset, typeOfEmail) => {
    try {


        // Get games scheduled to start in the offset hours
        var currentTime = new Date();
        var cutoff = new Date();
        cutoff.setHours(cutoff.getHours() + hoursOffset)

        let allGames = await Game.find({
            startTime: {
                $gt: currentTime,
                $lt: cutoff
            }
        })

        if (allGames.length == 0) {
            return
        }

        const imgAttachments = []
        var htmlBody = ''
        let team1, team2

        for (var gameObj of allGames) {

            team1 = await Team.findById(gameObj.team1)
            team2 = await Team.findById(gameObj.team2)

            var teamNames = [team1.shortName, team2.shortName]
            var gameNumber = gameObj.gameNumber
            var gameId = gameObj._id
            var gameStartTime = new Date(gameObj.startTime)

            htmlBody += '<h2>Game ' + gameNumber + ' <a href="https://prediction-league.netlify.app/predict/' + gameId + '">Predict now!</a> </h2> <h4>Scheduled start: ' + gameStartTime.getHours() + ':00 PM IST</h4>'
            for (var teamname of teamNames) {
                imgAttachments.push({
                    filename: teamname + '.png',
                    path: __dirname + '../../logos/' + teamname + 'roundbig.png',
                    cid: teamname + 'logo'
                })
                htmlBody += ' <img src="cid:' + teamname + 'logo" />'
            }
        }

        var month = currentTime.getMonth() + 1
        

        var transporter = nodemailer.createTransport({
            service: config.nodemailer.SERVICE,
            auth: {
                user: config.nodemailer.EMAIL_ID,
                pass: config.nodemailer.PASSWORD
            }
        });

        var mailOptions = {
            from: 'jayasurya1796@gmail.com',
            subject: 'IPL Prediction league ' + typeOfEmail + ' ' + currentTime.getDate() + "/" + month,
            html: htmlBody + '<hr><a href="https://prediction-league.netlify.app/leaderboard">View Leaderboard</a> | <a href="https://prediction-league.netlify.app/predictions">Predict other games</a> | <a href="google.com">Unsubscribe</a>',
            attachments: imgAttachments,
        };

        // let subscribedUsers = await Users.find({
        //     sendEmail: true
        // })

        // for (var obj of subscribedUsers) {
        //     mailOptions.to = obj.email
        //     var info = await transporter.sendMail(mailOptions)
        //     console.log('Email sent to ' + obj.email + ': ' + info.response);
        // }

        
        let subscribedUsers = ["jayasurya.pinaki@sjsu.edu", "chandher0596@gmail.com", "rsujith83@gmail.com"]

        for (var obj of subscribedUsers) {
            mailOptions.to = obj
            var info = await transporter.sendMail(mailOptions)
            console.log('Email sent to ' + obj + ': ' + info.response);
        }

    } catch (err) {
        console.log(`Error in sending mail ${err}`)
    }

}