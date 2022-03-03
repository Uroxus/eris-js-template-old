const { Event } = require( "../../Classes/Event.js" )
const { extractWebhookValues } = require( "../../Modules/Utilities.js" )

/**
 * @class
 * @event shardDisconnect
 * @link https://abal.moe/Eris/docs/Client#event-shardDisconnect
 */
module.exports = class ShardDisconnect extends Event {
    constructor() {
        super( 'shardDisconnect' )
    }

    /**
     * Called every time the bot receives an event of this type
     * @param {import("../Classes/Client.js").BotClient} BotClient 
     * @param {Error=} Error
     * @param {Number} shardId
     */
    async invoke ( BotClient, Error, shardId ) {
        this.debug( `Shard ${ shardId } disconnected` )
        this.logger.info( `[SHARD ${ shardId }] Disconnected` )

        if ( process.env.CONNECTIVITY_WEBHOOK && ( ( process.env.TESTING === "true" && process.env.CONNECTIVITY_WEBHOOK_ON_TESTING === "true" ) || process.env.TESTING !== "true" ) ) {
            const [ id, token ] = extractWebhookValues( process.env.CONNECTIVITY_WEBHOOK )

            BotClient.executeWebhook( id, token, {
                "content": `🔴 **Shard ${ shardId }** | Disconnected${ Error ? `: \`${ Error }\`` : '' }`
            } ).catch( ( error ) => {
                this.logger.alert( `[SHARD DISCONNECT] Failed to log disconnect of shard ${ shardId }... ${ error }` )
            } )

            BotClient.EventManager.reload()
        }
    }
}