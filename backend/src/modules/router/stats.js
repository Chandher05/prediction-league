`use strict`

import express from 'express';
import statsController from '../controller/stats';

const router = express.Router();

router.get('/get/predictions', statsController.getData);
router.get('/leaderboard', statsController.getLeaderboard);
router.get('/next-game', statsController.scheduledGames);
router.get('/current-game-predictions', statsController.currentGamePredictions);
router.get('/message', statsController.getMessage);

module.exports = router;
