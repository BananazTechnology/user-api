import express from 'express'
import controller from '../controllers/userApi'
const router = express.Router()

router.get('/userAPI/user/:id', controller.getUser)
router.get('/userAPI/user/getByDiscord/:discordID', controller.getDiscrodUser)
router.post('/userAPI/user', controller.createUser)

export = router;
