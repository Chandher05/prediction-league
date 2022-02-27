`use strict`

import express from 'express';
import teamsController from '../controller/teams';

const router = express.Router();

router.post('/add', teamsController.addTeam);
router.get('/all', teamsController.allTeams);
router.get('/id/:teamId', teamsController.getTeamById);
router.put('/update', teamsController.updateTeam);

module.exports = router;
