/**
 * @file Template for Client events
 */
import Debug from "debug"

/**
 * Event wrapper
 * @class
 */
export class Event {
    /**
     * Used to wrap each client event for the EventManager
     * @param {String} eventName 
     * @param {Boolean} once 
     */
    constructor( name, once = false ) {
        this.name = name
        this.once = once

        this.debug = Debug( `client:event:${ once ? 'once' : 'on' }:${ name }` )
        this.debug( 'loaded' )
    }

    /**
     * The function called every time an event of this type is received
     * @param {import("../bot.js").BotWorker} BotWorker 
     * @param {...any} params 
     */
    async invoke ( BotWorker, ...params ) {
        console.log( `received event with params: ${ params.join( ", " ) }` )
    }
}