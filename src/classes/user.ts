import { UserDB } from '../database/db'
import { RowDataPacket } from 'mysql2'

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

  static getUserByDiscordID = (discordID: string, callback: Function) => {
    try {
      const db = UserDB.getConnection()

      const queryString = `
        SELECT u.id, u.discordID, u.discordName, u.walletAddress
        FROM users AS u
        WHERE u.discordID = '${discordID}'`

      if (db) {
        db.query(queryString, (err, result) => {
          if (err) { callback(err, 'Error Code RCLUS2'); return }

          const row = (<RowDataPacket> result)[0]
          if (row.id) {
            const user: User = new User(row.id, row.discordID, row.discordName, row.walletAddress)
            callback(null, user)
          } else {
            callback(null, undefined)
          }
        })

        db.end()
      }
    } catch {
      callback(null, 'Error Code SRCLUS1')
    }
  }
}
