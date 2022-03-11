import mysql from 'mysql2'
import * as dotenv from 'dotenv'
dotenv.config()

const port = process.env.DB_PORT ? +process.env.DB_PORT : undefined

// eslint-disable-next-line no-unused-vars
export class UserDB {
  static getConnection (): mysql.Connection|undefined {
    console.log('Attempting DB Connection')
    try {
      return mysql.createConnection({
        host: process.env.DB_HOST,
        port: port,
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: process.env.DB_NAME
      })
    } catch {
      console.log('Error Code: UA-SRDADB1')
    }
  }

  static checkString (str: string|undefined): string {
    if (str === 'null' || str === 'undefined') {
      str = 'null'
    } else if (str) {
      str = `'${str}'`
    } else {
      str = 'null'
    }

    return str
  }
}
