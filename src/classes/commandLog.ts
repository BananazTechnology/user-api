import { OkPacket, RowDataPacket } from 'mysql2'
import { UserDB } from '../database/db'

export class CommandLog {
  private id: number;
  private user: string;
  private server: string;
  private channel: string;
  private command: string;
  private subCommand: string|undefined;
  private options: string|undefined;
  private success: boolean = false;
  private status: string;
  private message: string;
  private timestamp: string;

  private constructor (id: number, user: string, server: string, channel: string, command: string, subCommand: string|undefined, options: string|undefined, success: boolean = false, status: string = 'null', message: string = 'null', timestamp: string) {
    this.id = id
    this.user = user
    this.server = server
    this.channel = channel
    this.command = command
    this.subCommand = subCommand
    this.options = options
    this.success = success
    this.status = status
    this.message = message
    this.timestamp = timestamp
  }

  static async getRecentCmd (id: number, cmd: string): Promise<CommandLog|undefined> {
    const db = new UserDB()

    const queryString = `
      SELECT cl.id, cl.user, ds.discordID as server, dc.discordID AS channel, cl.command, cl.subCommand, cl.options, CAST(cl.timestamp AS CHAR) AS timestamp, cl.success, cl.status, cl.message
      FROM commandLog cl
      JOIN discordChannels dc ON dc.id = cl.channel
      JOIN discordServers ds ON ds.id = dc.server
      WHERE cl.user = ${id}
      AND cl.command LIKE '%${cmd}%'
      ORDER BY cl.timestamp DESC
      LIMIT 1`

    const result = await db.query(queryString)

    return new Promise((resolve, reject) => {
      try {
        const row = (<RowDataPacket> result)[0]
        if (row) {
          const log: CommandLog = new CommandLog(row.id, row.user, row.server, row.channel, row.command, row.subCommand, row.options, row.success, row.status, row.message, UserDB.getISOString(row.timestamp))
          resolve(log)
        } else {
          resolve(undefined)
        }
      } catch {
        reject(new Error('DB Connection OR Query Issue'))
      }
    })
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

    const result = await db.query(queryString)

    return new Promise((resolve, reject) => {
      try {
        if ((<OkPacket> result).insertId) {
          const insertId = (<OkPacket> result).insertId
          const log: CommandLog = new CommandLog(insertId, user, server, channel, command, subCommand, options, false, undefined, undefined, new Date().toUTCString())
          resolve(log)
        } else {
          resolve(undefined)
        }
      } catch {
        reject(new Error('DB Connection OR Query Issue'))
      }
    })
  }

  static async completeTransaction (id: number, user: string, server: string, channel: string, command: string, subCommand: string|undefined, options: string|undefined, success: boolean, status: string, message: string): Promise<CommandLog|undefined> {
    const db = new UserDB()
    user = UserDB.checkString(user)
    server = UserDB.checkString(server)
    channel = UserDB.checkString(channel)
    command = UserDB.checkString(command)
    subCommand = UserDB.checkString(subCommand)
    options = UserDB.checkString(options)
    status = UserDB.checkString(status)
    message = UserDB.checkString(message)

    const queryString = `
      UPDATE commandLog cl
      SET cl.success = ${success}, cl.status = ${status}, cl.message = ${message}
      WHERE cl.id = ${id}`

    const result = await db.query(queryString)

    return new Promise((resolve, reject) => {
      try {
        if ((<RowDataPacket> result).affectedRows) {
          const log: CommandLog = new CommandLog(id, user, server, channel, command, subCommand, options, success, status, message, new Date().toUTCString())
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
