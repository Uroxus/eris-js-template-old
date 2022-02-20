/**
 * @file Client defines the running bot instance
 */

import Eris, { Client } from "eris"
import { Logger } from "../Modules/Logger.js"
import { EventManager } from "../Managers/EventManager.js"

import Debug from "debug"
const debug = Debug( "client" )

/**
 * Bot Instance
 * @class
 * @extends Client
 */
export class BotClient extends Client {
    /**
     * Create and start new bot instance
     * @param {String} token 
     * @param {Eris.ClientOptions} options 
     */
    constructor( token, options ) {
        super( token, options )
        Logger.notice( `[MODE] ${ process.env.TESTING === "true" ? 'development' : 'production' }` )

        this.EventManager = new EventManager( this )

        this.connect().then( () => debug( 'connected' ) ).catch( ( error ) => debug( `connection failed... ${ error }` ) )
    }
}
