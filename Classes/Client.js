/**
 * @file Client defines the running bot instance
 */

const { Client, ClientOptions } = require( "eris" )
const { Logger } = require( "../Modules/Logger.js" )
const { EventManager } = require( "../Managers/EventManager.js" )
const debug = require( "debug" )( "client" )

/**
 * Bot Instance
 * @class
 * @extends Client
 */
module.exports.BotClient = class extends Client {
    /**
     * Create and start new bot instance
     * @param {String} token 
     * @param {ClientOptions} options 
     */
    constructor( token, options ) {
        super( token, options )
        Logger.notice( `[MODE] ${ process.env.TESTING === "true" ? 'development' : 'production' }` )
        this.EventManager = new EventManager( this )

        this.connect().then( () => debug( 'connected' ) ).catch( ( error ) => debug( `connection failed... ${ error }` ) )
    }
}
