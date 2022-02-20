/**
 * @file Template for Client events
 */
import Debug from "debug"
import { Logger } from "../Modules/Logger.js"

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

        this.logger = Logger
    }

    async invoke ( BotClient, ...params ) {
        this.debug( `received event with params: ${ params.join( ", " ) }` )
    }
}