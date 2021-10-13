`use strict`

import express from 'express';
import userController from '../controller/users';

const router = express.Router();

router.post('/add', userController.addUser);
router.get('/all', userController.allUsers);
router.get('/id/:userId', userController.getUserById);
router.put('/update', userController.updateUser);

module.exports = router;
