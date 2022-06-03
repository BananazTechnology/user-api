import mysql from 'mysql2'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve('./config.env') })

const port = process.env.DB_PORT ? +process.env.DB_PORT : undefined

// eslint-disable-next-line no-unused-vars
export class UserDB {
  private dbConfig = {
    connectionLimit: 10,
    host: process.env.DB_HOST,
    port: port,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
  }

  private pool: mysql.Pool = mysql.createPool(this.dbConfig)

  query (query: string): Promise<mysql.RowDataPacket[] | mysql.RowDataPacket[][] | mysql.OkPacket | mysql.OkPacket[] | mysql.ResultSetHeader> {
    return new Promise((resolve, reject) => {
      this.pool.query(query, (err, result) => {
        if (err) { reject(err) }
        resolve(result)
      })
    })
  }

  static checkString (str: string|undefined): string {
    if (str === 'null' || str === 'undefined') {
      str = 'null'
    } else if (str) {
      str = str.toString()
      str = `'${str.replace(/'/g, '\\\'')}'`
    } else {
      str = 'null'
    }

    return str
  }

  static getISOString (utcString: string|undefined): string {
    if (utcString) {
      const [date, time] = utcString.split(' ')
      return `${date}T${time}.000Z`
    } else {
      return 'null'
    }
  }
}
