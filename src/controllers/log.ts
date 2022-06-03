import { Request, Response, NextFunction } from 'express'
import { CommandLog } from '../classes/commandLog'

const getRecent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id: number = +(req.params.id)

    const log = await CommandLog.getRecentByID(id)

    res.status(200).json({ data: log })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}

const newLog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: string = req.body.user
    const server: string = req.body.server
    const channel: string = req.body.channel
    const command: string = req.body.command
    const subCommand: string = req.body.subCommand
    const options: string = req.body.options

    const log = await CommandLog.logInteraction(user, server, channel, command, subCommand, options)

    res.status(200).json({ data: log })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}

const completeLog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id: number = req.body.id
    const user: string = req.body.user
    const server: string = req.body.server
    const channel: string = req.body.channel
    const command: string = req.body.command
    const subCommand: string = req.body.subCommand
    const options: string = req.body.options
    const success: boolean = req.body.success
    const status: string = req.body.status
    const message: string = req.body.message

    const log = await CommandLog.completeTransaction(id, user, server, channel, command, subCommand, options, success, status, message)

    res.status(200).json({ data: log })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}

export default { getRecent, newLog, completeLog }
