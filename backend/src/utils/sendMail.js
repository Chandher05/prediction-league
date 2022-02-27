import nodemailer from "nodemailer"
import Game from '../models/mongoDB/game';
import Team from '../models/mongoDB/team';
import config from '../../config'

var sendEmail = async () => {

    var transporter = nodemailer.createTransport({
        service: config.nodemailer.SERVICE,
        auth: {
            user: config.nodemailer.EMAIL_ID,
            pass: config.nodemailer.PASSWORD
        }
    });

    var currentTime = new Date();
    var cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + 1)

    let allGames = await Game.find({
        startTime: {
            $gt: currentTime,
            $lt: cutoff
        }
    })



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

    let mailerList = ['jayasurya.pinaki@sjsu.edu', 'cheatan.r@gmail.com', 'chandher0596@gmail.com']
    
    var month = currentTime.getMonth() + 1
    for (var email of mailerList) {
        var mailOptions = {
            from: 'jayasurya1796@gmail.com',
            to: email,
            subject: 'IPL Prediction league reminder ' + currentTime.getDate() + "/" + month,
            html: htmlBody + '<hr><a href="https://prediction-league.netlify.app/leaderboard">View Leaderboard</a> | <a href="https://prediction-league.netlify.app/predictions">Predict other games</a> | <a href="google.com">Unsubscribe from reminder email</a>',
            attachments: imgAttachments,
        };
    
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

    return;
}

export default sendEmail;