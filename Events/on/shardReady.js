const { Event } = require( "../../Classes/Event.js" )
const { extractWebhookValues } = require( "../../Modules/Utilities.js" )

/**
 * @class
 * @event shardReady
 * @link https://abal.moe/Eris/docs/Client#event-shardReady
 */
module.exports = class ShardReady extends Event {
    constructor() {
        super( 'shardReady' )
    }

    /**
     * Called every time the bot receives an event of this type
     * @param {import("../Classes/Client.js").BotClient} BotClient 
     * @param {Number} shardId
     */
    async invoke ( BotClient, shardId ) {
        this.debug( `Shard ${ shardId } turned ready` )
        this.logger.info( `[SHARD ${ shardId }] Turned ready` )

        if ( process.env.CONNECTIVITY_WEBHOOK && ( ( process.env.TESTING === "true" && process.env.CONNECTIVITY_WEBHOOK_ON_TESTING === "true" ) || process.env.TESTING !== "true" ) ) {
            const [ id, token ] = extractWebhookValues( process.env.CONNECTIVITY_WEBHOOK )

            BotClient.executeWebhook( id, token, {
                "content": `🟢 **Shard ${ shardId }** | Turned ready`
            } ).catch( ( error ) => {
                this.logger.alert( `[SHARD READY] Failed to log ready of shard ${ shardId }... ${ error }` )
            } )
        }
    }
}