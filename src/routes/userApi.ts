import express from 'express'
import userController from '../controllers/user'
import logController from '../controllers/log'
const router = express.Router()

router.get('/userAPI/user/:id', userController.getUser)
router.put('/userAPI/user/:id', userController.editUser)
router.get('/userAPI/user/getByDiscord/:discordID', userController.getDiscrodUser)
router.post('/userAPI/user', userController.createUser)

router.post('/userAPI/log', logController.newLog)

export = router;
