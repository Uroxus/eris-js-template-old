/**
 * @file Define class instance of the running bot
 */

import Eris, { Client, User } from "eris"
import { loadEvents } from "../Modules/Loader.js"
import { Logger } from "../Modules/Logger.js"
import CommandManager from "./CommandManager.js"
import Database from "./Database.js"

/**
 * Class representing a bot instance
 * @class
 * @extends Eris.Client
 */
export default class botClient extends Client {
    /**
     * Create a new bot instance
     * @param {String} token 
     * @param {Eris.ClientOptions} clientOptions 
     */
    constructor( token, clientOptions ) {
        super( token, clientOptions )

        this.commandManager = new CommandManager( this )
        this.database = new Database( process.env.MONGO_CONNECTION )

        loadEvents( this )
        Logger.status( `[MODE] ${ process.env.TESTING === "true" ? 'development' : 'production' }` )
        this.connect()
    }

    /**
     * Get the name#descriminator of a user
     * @param {Eris.User} user
     * @returns {String} username#discriminator
     */
    getUserString ( user ) {
        return `${ user.username }#${ user.discriminator }`
    }
}