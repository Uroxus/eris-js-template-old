/**
 * @file Create a log every time a shard turns ready
 */

import botClient from "../../Classes/Client"
import { Logger } from "../../Modules/Logger"
import { extractWebhookElements } from "../../Modules/Utilities"

/**
 * @event shardReady
 * @link https://abal.moe/Eris/docs/Client#event-shardReady
 * @param {botClient} Client
 * @param {Number} shardId
 */
export default async function ( Client, shardId ) {
    Logger.status( `[SHARD] Shard ${ shardId } is ready` )

    if ( process.env.CONNECTIVITY_WEBHOOK && ( ( process.env.TESTING === "true" && process.env.CONNECTIVITY_WEBHOOK_ON_TESTING === 'true' ) || process.env.TESTING !== "true" ) ) {
        const [ id, token ] = extractWebhookElements( process.env.CONNECTIVITY_WEBHOOK )
        Client.executeWebhook( id, token, {
            "embeds": [
                {
                    "title": "Shard Status",
                    "description": `Shard ${ shardId } is **Ready**`,
                    "color": parseInt( process.env.EMBED_GREEN ),
                    "timestamp": new Date(),
                    "footer": { "text": `${ Client.getUserString( Client.user ) }`, "icon_url": Client.user.dynamicAvatarURL() }
                }
            ]
        } ).catch( ( error ) => {
            Logger.warn( `[SHARD] Shard ${ shardId } failed to post a ready status: ${ error }` )
        } )
    }
}