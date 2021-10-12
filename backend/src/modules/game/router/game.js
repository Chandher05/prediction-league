`use strict`

import express from 'express';
import gameController from '../controller/game';

const router = express.Router();

router.get('/all', gameController.getAllGames);
router.get('/scheduled', gameController.scheduledGames);
router.post('/add', gameController.addGame);
router.put('/update', gameController.updateGame);
router.delete('/delete/:gameId', gameController.deleteGame);

module.exports = router;
