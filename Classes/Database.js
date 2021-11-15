/**
 * @file Define a class instance of a MongoDB connection
 */

import { Mongoose } from "mongoose"
import { Logger } from "../Modules/Logger.js"

/**
 * Define and manage a connection to a Mongo database
 * @class
 */
export default class Database {
    /**
     * Create a connection to a Mongo database
     * @param {String} connectString 
     */
    constructor( connectString ) {
        this.connectString = connectString

        this.connect()
    }

    async connect () {
        return new Promise( ( resolve, reject ) => {
            Mongoose.connect( this.connectString, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: true,
                useCreateIndex: true
            } ).catch( ( error ) => {
                Logger.error( `[DATABASE] Failed to establish a connection: ${ error }` )
                return reject( error )
            } )

            Mongoose.connection.on( "open", () => Logger.status( `[DATABASE] Connection established` ) )
            Mongoose.connection.on( "close", () => Logger.status( `[DATABASE] Connection closed` ) )
            Mongoose.connection.on( "reconnected", () => Logger.status( `[DATABASE] Connection resumed` ) )
            Mongoose.connection.on( "error", ( error ) => Logger.error( `[DATABASE] Encountered an error: ${ error }` ) )

            return resolve( this )
        } )
    }
}