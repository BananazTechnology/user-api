import { Request, Response, NextFunction } from 'express'
import { User } from '../classes/user'

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id: number = +(req.params.id)

    const user = await User.getUserByID(id)

    res.status(200).json({ data: user })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}

const getDiscrodUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const discordID: string = String(req.params.discordID)

    const user = await User.getUserByDiscordID(discordID)

    res.status(200).json({ data: user })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const discordID: string = req.body.discordID
    const discordName: string = req.body.discordName
    const walletAddress: string = req.body.walletAddress

    const user = await User.createUser(discordID, discordName, walletAddress)

    res.status(200).json({ data: user })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}

const editUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const discordID: string = req.body.discordID
    const discordName: string = req.body.discordName
    const walletAddress: string = req.body.walletAddress
    const id: number = +(req.params.id)

    const user = await User.editUser(id, discordID, discordName, walletAddress)

    res.status(200).json({ data: user })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}

export default { getUser, getDiscrodUser, createUser, editUser }
