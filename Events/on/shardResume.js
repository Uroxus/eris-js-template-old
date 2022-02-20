import { BotClient } from "../../Classes/Client.js"
import { Event } from "../../Classes/Event.js"
import { extractWebhookValues } from "../../Modules/Utilities.js"

/**
 * @class
 * @event shardResume
 * @link https://abal.moe/Eris/docs/Client#event-shardResume
 */
export default class ShardResume extends Event {
    constructor() {
        super( 'shardResume' )
    }

    /**
     * Called every time the bot receives an event of this type
     * @param {BotClient} BotClient 
     * @param {Number} shardId
     */
    async invoke ( BotClient, shardId ) {
        this.debug( `Shard ${ shardId } resumed` )
        this.logger.info( `[SHARD ${ shardId }] Resumed` )

        if ( process.env.CONNECTIVITY_WEBHOOK && ( ( process.env.TESTING === "true" && process.env.CONNECTIVITY_WEBHOOK_ON_TESTING === "true" ) || process.env.TESTING !== "true" ) ) {
            const [ id, token ] = extractWebhookValues( process.env.CONNECTIVITY_WEBHOOK )

            BotClient.executeWebhook( id, token, {
                "content": `🟠 **Shard ${ shardId }** | Resumed`
            } ).catch( ( error ) => {
                this.logger.alert( `[SHARD RESUME] Failed to log resume of shard ${ shardId }... ${ error }` )
            } )
        }
    }
}