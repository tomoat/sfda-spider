// import mysql from 'promise-mysql'
// import { config } from './config'
// import logger from './logger'

const yamlConfig = require('yaml-config')
const mysql = require('mysql2/promise')
const config = yamlConfig.readConfig(__dirname + '/config.yaml')

// const db = mysql.createPool(config.mysql)
const pool = mysql.createPool(config.mysql)
// const db = () => pool.getConnection();


module.exports = pool


