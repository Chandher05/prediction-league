`use strict`

import express from 'express';
import gameController from '../controller/prediction';

const router = express.Router();

router.post('/new', gameController.addPrediction);
router.get('/game/:gameId', gameController.getPredictionByGame);

module.exports = router;
