`use strict`

import express from 'express';
import gameController from '../controller/prediction';

const router = express.Router();

router.post('/new', gameController.addPrediction);
router.get('/game/:gameId', gameController.getPredictionByGame);
router.get('/leaderboard', gameController.getLeaderboard);
router.get('/user/:userId', gameController.getPredictionsOfUser);
// router.put('/update', gameController.updatePrediction);

module.exports = router;
