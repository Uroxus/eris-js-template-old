const { Event } = require( "../../Classes/Event.js" )

/**
 * @class
 * @event error
 * @link https://abal.moe/Eris/docs/Client#event-error
 */
module.exports = class Error extends Event {
    constructor() {
        super( 'error' )
    }

    /**
     * Called every time the bot receives an event of this type
     * @param {import("../Classes/Client.js").BotClient} BotClient 
     * @param {Error} Error
     * @param {Number} shardId
     */
    async invoke ( BotClient, Error, shardId ) {
        this.debug( `Shard ${ shardId } encountered an error... ${ Error }` )
        this.logger.crit( `Shard ${ shardId } encountered an error... ${ Error }` )
    }
}