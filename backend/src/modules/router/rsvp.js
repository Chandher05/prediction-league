`use strict`

import express from 'express';
import rsvpController from '../controller/rsvp';

const router = express.Router();

router.get('/get', rsvpController.getData);
router.post('/add', rsvpController.addRsvp);
router.put('/update/:id', rsvpController.updateRsvp);
router.delete('/delete/:id', rsvpController.deleteRsvp);

module.exports = router;
