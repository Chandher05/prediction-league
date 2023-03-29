import nodemailer from "nodemailer"
import Game from '../models/mongoDB/game';
import Team from '../models/mongoDB/team';
import Users from '../models/mongoDB/users';
import config from '../../config'
var CronJob = require('cron').CronJob


var job1 = new CronJob('0 0 * * *', async () => {
    sendMail(24, "schedule")
    console.log('CRON STARTED!')
}, null, true, "Asia/Kolkata")

var job2 = new CronJob('00 15 * * *', async () => {
    sendMail(2, "reminder")
    console.log('CRON reminder!')
}, null, true, "Asia/Kolkata")

var job3 = new CronJob('00 19 * * *', async () => {
    sendMail(2, "reminder")
    console.log('CRON reminder 2!')
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
            var gameStartHour = parseInt(gameStartTime.getHours()) + 5

            htmlBody += '<h2>Game ' + gameNumber + ' <a href="' + config.APPLICATION_URL + '/predict/' + gameId + '">Predict now!</a> </h2> <h4>Scheduled start: ' + gameStartHour + ':30 PM IST</h4>'
            for (var teamname of teamNames) {
                imgAttachments.push({
                    filename: teamname + '.png',
                    path: __dirname + '/../logos/' + teamname + 'roundbig.png',
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

        var currentIndiaTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
        var todayArr = currentIndiaTime.split("/")
        var todayDate = todayArr[1]
        var mailOptions = {
            from: 'jayasurya1796@gmail.com',
            subject: 'IPL Prediction League ' + typeOfEmail + ' ' + todayDate + "/" + month,
            html: htmlBody + '<hr><a href="' + config.APPLICATION_URL + '/leaderboard">View Leaderboard</a> | <a href="' + config.APPLICATION_URL + '/predictions">Predict other games</a> | <a href="' + config.APPLICATION_URL + '/unsubscribe">Unsubscribe</a>',
            attachments: imgAttachments,
        };

        let subscribedUsers = await Users.find({
            sendEmail: true
        })
        
        // let subscribedUsers = ["jayasurya.pinaki@sjsu.edu", "chandher0596@gmail.com", "rsujith83@gmail.com"]

        for (var obj of subscribedUsers) {
            mailOptions.to = obj.email
            var info = await transporter.sendMail(mailOptions)
            console.log('Email sent to ' + obj.username + ': ' + info.response);
        }

    } catch (err) {
        console.log(`Error in sending mail ${err}`)
    }

}