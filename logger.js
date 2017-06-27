const winston = require('winston')
const moment = require('moment')

const logger = new (winston.Logger) ({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: __dirname + '/logs/' + moment().format('YYYY-MM-DD') + '.log',
      handleException: true,
      json: false,
      maxSize: 5242880, //5mb
      // maxFiles: 2,
      colorize: false
    }),
    new winston.transports.Console({
      level: 'debug',
      prettyPrint: true,
      timestamp: true,
      lable: 'cronTask',
      json: false,
      colorize: true
    })
  ]
})
// export default logger
module.exports = logger
// const loger = require('winston')
