/**
 * @file Define class instance of the running bot
 */

import Eris, { Client } from "eris"

/**
 * Class representing a bot instance
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