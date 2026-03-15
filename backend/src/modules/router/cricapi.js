`use strict`

import express from 'express';
import teamsController from '../controller/cricapi';

const router = express.Router();

router.get('/series-id', teamsController.getSeriesId);
router.get('/get-games', teamsController.getGames);
router.post('/add-games', teamsController.addGames);
router.post('/validate-and-add', teamsController.validateAndAddTeams);

module.exports = router;
