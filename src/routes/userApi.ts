import express from 'express'
import controller from '../controllers/userApi'
const router = express.Router()

router.get('/userAPI/user/:discordID', controller.getUser)
router.post('/userAPI/user', controller.createUser)

export = router;
