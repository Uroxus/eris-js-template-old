/**
 * @file Define, create and manage Winston logging
 */

import winston from "winston"

const levels = {
    error: 0,
    warn: 1,
    status: 2,
    debug: 3
}

winston.addColors( {
    error: "red bold underline",
    warn: "yellow",
    status: "white",
    debug: "blue"
} )

const colorizer = winston.format.colorize()
const format = winston.format.combine(
    winston.format.timestamp( { format: 'HH:mm:ss DD-MM-YY' } ),
    winston.format.printf( ( info ) => colorizer.colorize( info.level, `${ info.timestamp }  [${ ( info.level ).toUpperCase() }] | ${ info.message }` ) )
)

const transports = [
    new winston.transports.Console(),
    new winston.transports.File( {
        filename: "Logs/error.log",
        maxsize: 10000000, // 10MB
        maxFiles: 5,
        level: "error"
    } ),
    new winston.transports.File( {
        filename: "Logs/all.log",
        maxsize: 50000000, // 50MB
        maxFiles: 10
    } )
]

const exceptionHandlers = [
    new winston.transports.File( {
        filename: "Logs/exceptions.log",
        maxsize: 20000000, // 20MB
        maxFiles: 1
    } )
]

export const Logger = winston.createLogger( {
    level: process.env.TESTING === "true" ? "debug" : "status",
    levels,
    format,
    transports,
    exceptionHandlers,
    exitOnError: false
} )