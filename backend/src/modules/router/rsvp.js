`use strict`

import express from 'express';
import rsvpController from '../controller/rsvp';

const router = express.Router();

router.get('/get', rsvpController.getData);
router.post('/add', rsvpController.addRsvp);

module.exports = router;
