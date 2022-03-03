/**
 * @file Supports project-wide, organised information, error and status logging
 */

const winston = require( "winston" )
require( "dotenv" ).config()

const jsonFormat = winston.format.combine( winston.format.timestamp( { format: 'HH:mm:ss DD-MM-YY' } ), winston.format.json() )

/**
 * Create a log of some important information
 * @exports {Logger}
 * @method {emerg}
 * @method {alert} 
 * @method {crit}
 * @method {error} Something went wrong that shouldn't have
 * @method {warning} Something went wrong but it's not catastrophic
 * @method {notice} 
 * @method {info} Logging a status or some useful information
 */
module.exports.Logger = winston.createLogger( {
    level: process.env.TESTING === "true" ? "debug" : "warning",
    levels: winston.config.syslog.levels,

    transports: [
        new winston.transports.Console( {
            format: winston.format.combine(
                winston.format( ( info ) => ( { ...info, level: info.level.toUpperCase() } ) )(),
                winston.format.errors( { stack: true } ),
                winston.format.colorize(),
                winston.format.timestamp( { format: 'HH:mm:ss DD-MM-YY' } ),
                winston.format.align(),
                winston.format.printf( info => `${ info.timestamp } [${ info.level }]: ${ info.message }` ) )
        } ),
        new winston.transports.File( { filename: "Logs/error.log", level: "error", format: jsonFormat } ),
        new winston.transports.File( { filename: "Logs/all.log", maxSize: 500000000, format: jsonFormat } )
    ],

    exceptionHandlers: [
        new winston.transports.File( { filename: "Logs/exceptions.log", maxsize: 20000000, format: jsonFormat } )
    ],

    rejectionHandlers: [
        new winston.transports.File( { filename: "Logs/rejections.log", maxsize: 20000000, format: jsonFormat } )
    ]
} )