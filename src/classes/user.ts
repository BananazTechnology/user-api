import { UserDB } from '../database/db'
import { OkPacket, RowDataPacket } from 'mysql2'

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
        console.debug(queryString)
        db.query(queryString, (err, result) => {
          if (err) { callback(err, 'Error Code: UA-SRCLUS2'); return }

          const row = (<RowDataPacket> result)[0]
          if (row) {
            const user: User = new User(row.id, row.discordID, row.discordName, row.walletAddress)
            callback(null, user)
          } else {
            callback(null, undefined)
          }
        })

        db.end()
      } else {
        callback(null, 'Error Code: UA-SRCLUS6')
      }
    } catch {
      console.debug('DB Connection Issue')
      callback(null, 'Error Code: UA-SRCLUS1')
    }
  }

  static createUser = (discordID: string, discordName: string, walletAddress: string|undefined, callback: Function) => {
    try {
      discordID = UserDB.checkString(discordID)
      discordName = UserDB.checkString(discordName)
      walletAddress = UserDB.checkString(walletAddress)

      const db = UserDB.getConnection()

      const queryString = `
        INSERT INTO users
        (discordID, discordName, walletAddress)
        VALUES(${discordID}, ${discordName}, ${walletAddress});`

      if (db) {
        console.debug(queryString)

        db.query(queryString, (err, result) => {
          if (err) { callback(err, 'Error Code: UA-SRCLUS3'); return }

          const insertId = (<OkPacket> result).insertId
          console.log(result)
          callback(null, insertId)
        })

        db.end()
      } else {
        callback(null, 'Error Code: UA-SRCLUS5')
      }
    } catch {
      callback(null, 'Error Code: UA-SRCLUS4')
    }
  }
}
