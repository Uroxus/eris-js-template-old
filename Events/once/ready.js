const { Event } = require( "../../Classes/Event.js" )

/**
 * @class
 * @event ready
 * @link https://abal.moe/Eris/docs/Client#event-ready
 */
module.exports = class Ready extends Event {
    constructor() {
        super( 'ready', true )
    }

    /**
     * Called every time the bot receives an event of this type
     * @param {import("../Classes/Client.js").BotClient} BotClient 
     */
    async invoke ( BotClient ) {
        this.logger.info( '[ALL SHARDS] Connection Established' )
    }
}