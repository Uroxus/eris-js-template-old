/**
 * @file Template for Client events
 */
const { Logger } = require( "../Modules/Logger.js" )

/**
 * Event wrapper
 * @class
 */
module.exports.Event = class {
    /**
     * Used to wrap each client event for the EventManager
     * @param {String} eventName 
     * @param {Boolean} once 
     */
    constructor( name, once = false ) {
        this.name = name
        this.once = once

        this.debug = require( "debug" )( `client:event:${ once ? 'once' : 'on' }:${ name }` )
        this.debug( 'loaded' )

        this.logger = Logger
    }

    /**
     * @param {import("../Classes/Client.js").BotClient} BotClient 
     * @param  {...any} params 
     */
    async invoke ( BotClient, ...params ) {
        this.debug( `received event with params: ${ params.join( ", " ) }` )
    }
}