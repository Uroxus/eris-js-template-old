import { BotClient } from "../../Classes/Client.js"
import { Event } from "../../Classes/Event.js"

/**
 * @class
 * @event ready
 * @link https://abal.moe/Eris/docs/Client#event-ready
 */
export default class Ready extends Event {
    constructor() {
        super( 'ready', true )
    }

    /**
     * Called every time the bot receives an event of this type
     * @param {BotClient} BotClient 
     */
    async invoke ( BotClient ) {
        this.logger.info( '[ALL SHARDS] Connection Established' )
    }
}