`use strict`

import express from 'express';
import userController from '../controller/users';

const router = express.Router();

router.post('/login', userController.loginUser);
router.post('/add', userController.addUser);
router.get('/all', userController.allUsers);
// router.get('/id/:userId', userController.getUserById);
router.put('/update', userController.updateUser);
router.put('/unsubscribe', userController.unsubscribeUser);

module.exports = router;
