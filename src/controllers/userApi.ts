import { Request, Response, NextFunction } from 'express'
import { User } from '../classes/user'

const getKey = async (req: Request, res: Response, next: NextFunction) => {
  const discordID: string = String(req.params.discordID)
  User.getUserByDiscordID(discordID, (err: Error, user: User) => {
    if (err) {
      return res.status(500).json({ message: err.message })
    }
    res.status(200).json({ data: user })
  })
}

export default { getKey }
