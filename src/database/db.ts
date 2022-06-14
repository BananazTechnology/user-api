import mysql, { createPool, Pool } from 'mysql2'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve('./config.env') })
const port = process.env.DB_PORT ? +process.env.DB_PORT : undefined

let globalPool: Pool | undefined

export async function dbQuery (query: string): Promise<mysql.RowDataPacket[] | mysql.RowDataPacket[][] | mysql.OkPacket | mysql.OkPacket[] | mysql.ResultSetHeader> {
  if (!globalPool) {
    globalPool = await createPool({
      connectionLimit: 10,
      host: process.env.DB_HOST,
      port: port,
      user: process.env.DB_USER,
      password: process.env.DB_PWD,
      database: process.env.DB_NAME
    })
  }

  return new Promise((resolve, reject) => {
    if (globalPool) {
      globalPool.query(query, (err, result) => {
        if (err) {
          console.log(err)
          reject(err)
        }
        resolve(result)
      })
    } else {
      reject(new Error('Db connection issue'))
    }
  })
}

export function checkString (str: string|undefined): string {
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

export function getISOString (utcString: string|undefined): string {
  if (utcString) {
    const [date, time] = utcString.split(' ')
    return `${date}T${time}.000Z`
  } else {
    return 'null'
  }
}
