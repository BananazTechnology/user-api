import { Request, Response, NextFunction } from 'express'
import { User } from '../classes/user'

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id: number = +(req.params.id)

    User.getUserByID(id, (err: Error, user: User) => {
      if (err) {
        return res.status(500).json({ message: err.message })
      }
      res.status(200).json({ data: user })
    })
  } catch {
    console.log('Error Code: UA-SRCOUS1')
  }
}

const getDiscrodUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const discordID: string = String(req.params.discordID)

    User.getUserByDiscordID(discordID, (err: Error, user: User) => {
      if (err) {
        return res.status(500).json({ message: err.message })
      }
      res.status(200).json({ data: user })
    })
  } catch {
    console.log('Error Code: UA-SRCOUS1')
  }
}

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const discordID: string = req.body.discordID
    const discordName: string = req.body.discordName
    const walletAddress: string = req.body.walletAddress
    console.log(req.body)

    User.createUser(discordID, discordName, walletAddress, (err: Error, user: User) => {
      if (err) {
        return res.status(500).json({ message: err.message })
      }
      res.status(200).json({ data: user })
    })
  } catch {
    console.log('Error Code: UA-SRCOUS2')
  }
}

export default { getUser, getDiscrodUser, createUser }
