/**
 * @file Create a log every time a shard disconnects
 */

import botClient from "../../Classes/Client";
import { Logger } from "../../Modules/Logger";
import { extractWebhookElements } from "../../Modules/Utilities";

/**
 * @event shardDisconnect
 * @link https://abal.moe/Eris/docs/Client#event-shardDisconnect
 * @param {botClient} Client
 * @param {Error=} Error
 * @param {Number} shardId
 */
export default async function ( Client, Error, shardId ) {
    Logger.status( `[SHARD] Shard ${ shardId } disconnected` )

    if ( process.env.CONNECTIVITY_WEBHOOK && ( ( process.env.TESTING === "true" && process.env.CONNECTIVITY_WEBHOOK_ON_TESTING === 'true' ) || process.env.TESTING !== "true" ) ) {
        const [ id, token ] = extractWebhookElements( process.env.CONNECTIVITY_WEBHOOK )
        Client.executeWebhook( id, token, {
            "embeds": [
                {
                    "title": "Shard Status",
                    "description": `Shard ${ shardId } has **Disconnected**\n${ Error ? `\`${ Error }\`` : '' }`,
                    "color": parseInt( process.env.EMBED_RED ),
                    "timestamp": new Date(),
                    "footer": { "text": `${ Client.getUserString( Client.user ) }`, "icon_url": Client.user.dynamicAvatarURL() }
                }
            ]
        } ).catch( ( error ) => {
            Logger.warn( `[SHARD] Shard ${ shardId } failed to post disconnect status: ${ error }` )
        } )
    }
}