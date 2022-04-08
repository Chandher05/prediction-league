`use strict`

import express from 'express';
import statsController from '../controller/stats';

const router = express.Router();

router.get('/get/predictions', statsController.getData);

module.exports = router;
