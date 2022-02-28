`use strict`

import express from 'express';
import userController from '../controller/users';

const router = express.Router();

router.post('/login', userController.loginUser);
router.post('/add', userController.addAdmin);
router.get('/all', userController.allUsers);
// router.get('/id/:userUID', userController.getUserById);
router.put('/update', userController.updateAdmin);
router.put('/unsubscribe', userController.unsubscribeUser);

module.exports = router;
