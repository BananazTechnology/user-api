import express from 'express'
import controller from '../controllers/userApi'
const router = express.Router()

router.get('/userAPI/getuser/:discordID', controller.getKey)

export = router;
