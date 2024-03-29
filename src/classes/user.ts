import { OkPacket, RowDataPacket } from 'mysql2'
import { checkString, dbQuery } from '../database/db'

export class User {
  id: number;
  discordID: string;
  discordName: string;
  walletAddress?: string;

  constructor (id: number, discordID: string, discordName: string, walletAddress?: string) {
    this.id = id
    this.discordID = discordID
    this.discordName = discordName
    this.walletAddress = walletAddress
  }

  static async getUserByID (id: number): Promise<User|undefined> {
    const queryString = `
      SELECT u.id, u.discordID, u.discordName, u.walletAddress
      FROM users AS u
      WHERE u.id = ${id}`

    const result = await dbQuery(queryString)

    return new Promise((resolve, reject) => {
      try {
        const row = (<RowDataPacket> result)[0]
        if (row) {
          const user: User = new User(row.id, row.discordID, row.discordName, row.walletAddress)
          resolve(user)
        } else {
          resolve(undefined)
        }
      } catch {
        reject(new Error('DB Connection OR Query Issue'))
      }
    })
  }

  static async getUserByDiscordID (discordID: string): Promise<User|undefined> {
    const queryString = `
      SELECT u.id, u.discordID, u.discordName, u.walletAddress
      FROM users AS u
      WHERE u.discordID = '${discordID}'`

    const result = await dbQuery(queryString)

    return new Promise((resolve, reject) => {
      try {
        const row = (<RowDataPacket> result)[0]
        if (row) {
          const user: User = new User(row.id, row.discordID, row.discordName, row.walletAddress)
          resolve(user)
        } else {
          resolve(undefined)
        }
      } catch {
        reject(new Error('DB Connection OR Query Issue'))
      }
    })
  }

  static async createUser (discordID: string, discordName: string, walletAddress: string|undefined): Promise<User|undefined> {
    discordID = checkString(discordID)
    discordName = checkString(discordName)
    walletAddress = checkString(walletAddress)

    const queryString = `
      INSERT INTO users
      (discordID, discordName, walletAddress)
      VALUES(${discordID}, ${discordName}, ${walletAddress});`

    const result = await dbQuery(queryString)

    return new Promise((resolve, reject) => {
      try {
        if ((<OkPacket> result).insertId) {
          const insertId = (<OkPacket> result).insertId
          const user: User = new User(insertId, discordID, discordName, walletAddress)
          resolve(user)
        } else {
          resolve(undefined)
        }
      } catch {
        reject(new Error('DB Connection OR Query Issue'))
      }
    })
  }

  static async editUser (id: number, discordID: string, discordName: string, walletAddress: string|undefined): Promise<User|undefined> {
    discordID = checkString(discordID)
    discordName = checkString(discordName)
    walletAddress = checkString(walletAddress)

    const queryString = `
      UPDATE users
      SET discordID = ${discordID}, discordName = ${discordName}, walletAddress = ${walletAddress}
      WHERE id = ${id};`

    const result = await dbQuery(queryString)

    return new Promise((resolve, reject) => {
      try {
        if ((<RowDataPacket> result).affectedRows) {
          const user: User = new User(id, discordID, discordName, walletAddress)
          resolve(user)
        } else {
          resolve(undefined)
        }
      } catch {
        reject(new Error('DB Connection OR Query Issue'))
      }
    })
  }
}
