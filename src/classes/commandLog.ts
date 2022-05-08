import { OkPacket } from 'mysql2'
import { UserDB } from '../database/db'

export class CommandLog {
  private id: number;
  private user: string;
  private server: string;
  private channel: string;
  private command: string;
  private subCommand: string|undefined;
  private options: string|undefined;

  private constructor (id: number, user: string, server: string, channel: string, command: string, subCommand: string|undefined, options: string|undefined) {
    this.id = id
    this.user = user
    this.server = server
    this.channel = channel
    this.command = command
    this.subCommand = subCommand
    this.options = options
  }

  static async logInteraction (user: string, server: string, channel: string, command: string, subCommand: string|undefined, options: string|undefined): Promise<CommandLog|undefined> {
    const db = new UserDB()
    user = UserDB.checkString(user)
    server = UserDB.checkString(server)
    channel = UserDB.checkString(channel)
    command = UserDB.checkString(command)
    subCommand = UserDB.checkString(subCommand)
    options = UserDB.checkString(options)

    await this.createchannel(server, channel)

    const queryString = `
      INSERT INTO commandLog
      (user, channel, command, subCommand, options)
      VALUES(
        (SELECT u.id FROM users u WHERE u.discordID = ${user} LIMIT 1),
        (SELECT dc.id FROM discordChannels dc WHERE dc.discordID = ${channel} LIMIT 1),
        ${command},
        ${subCommand},
        ${options}
      );`

    // console.log(queryString)
    const result = await db.query(queryString)

    return new Promise((resolve, reject) => {
      try {
        if ((<OkPacket> result).insertId) {
          const insertId = (<OkPacket> result).insertId
          const log: CommandLog = new CommandLog(insertId, user, server, channel, command, subCommand, options)
          resolve(log)
        } else {
          resolve(undefined)
        }
      } catch {
        reject(new Error('DB Connection OR Query Issue'))
      }
    })
  }

  private static async createServer (server: string): Promise<void> {
    const db = new UserDB()

    const queryString = `
      INSERT IGNORE INTO discordServers
      (discordID)
      VALUES(${server});`

    await db.query(queryString)

    return new Promise((resolve, reject) => {
      try {
        resolve()
      } catch {
        reject(new Error('DB Connection OR Query Issue'))
      }
    })
  }

  private static async createchannel (server: string, channel: string): Promise<void> {
    await this.createServer(server)

    const db = new UserDB()

    const queryString = `
    INSERT IGNORE INTO discordChannels
    (server, discordID)
    VALUES(
      (SELECT ds.id FROM discordServers ds WHERE ds.discordID = ${server} LIMIT 1),
      ${channel}
    );`

    await db.query(queryString)

    return new Promise((resolve, reject) => {
      try {
        resolve()
      } catch {
        reject(new Error('DB Connection OR Query Issue'))
      }
    })
  }
}
