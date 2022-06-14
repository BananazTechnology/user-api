import express from 'express'
import userController from '../controllers/user'
import logController from '../controllers/log'
const router = express.Router()

router.get('/userAPI/user/:id', userController.getUser)
router.get('/userAPI/user/getByDiscord/:discordID', userController.getDiscordUser)
router.put('/userAPI/user/:id', userController.editUser)
router.post('/userAPI/user', userController.createUser)

router.get('/userAPI/log/lastSuccess/:id/:cmd', logController.getRecent)
router.put('/userAPI/log', logController.completeLog)
router.post('/userAPI/log', logController.newLog)

export = router;
